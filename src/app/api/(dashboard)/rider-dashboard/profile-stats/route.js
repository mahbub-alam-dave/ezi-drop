// /app/api/rider/overview/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { dbConnect } from '@/lib/dbConnect';
import { authOptions } from '@/lib/authOptions';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'rider') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const Parcel = dbConnect("parcels");
    const User = dbConnect("users");
    
    const riderId = session.user.userId;
    const riderObjectId = new ObjectId(riderId);
    
    // Date ranges
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch all data in parallel
    const [
      riderProfile,
      activeDeliveries,
      todayDelivered,
      todayEarnings,
      pendingOrders,
      recentDeliveries,
      overallStats,
      totalEarnings
    ] = await Promise.all([
      // Rider profile
      User.findOne({ _id: riderObjectId }),
      
      // Active deliveries (in transit)
      Parcel.find({
        assignedRiderId: riderObjectId,
        status: { 
          $in: [
            'in_transit_to_warehouse', 
            'at_local_warehouse', 
            'awaiting_pickup_from_warehouse',
            'out_for_delivery'
          ] 
        }
      })
      .sort({ updatedAt: -1 })
      .limit(10)
      .toArray(),
      
      // Today's delivered count
      Parcel.countDocuments({
        assignedRiderId: riderObjectId,
        status: 'delivered',
        updatedAt: { $gte: today, $lt: tomorrow }
      }),
      
      // Today's earnings (rider's share from delivered parcels)
      Parcel.aggregate([
        {
          $match: {
            assignedRiderId: riderObjectId,
            status: 'delivered',
            updatedAt: { $gte: today, $lt: tomorrow }
          }
        },
        {
          $project: {
            riderEarning: {
              $reduce: {
                input: '$earnings.riders',
                initialValue: 0,
                in: {
                  $cond: [
                    { 
                      $and: [
                        { $eq: ['$$this.riderId', riderObjectId] },
                        { $eq: ['$$this.earned', true] }
                      ]
                    },
                    { $add: ['$$value', '$$this.amount'] },
                    '$$value'
                  ]
                }
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$riderEarning' }
          }
        }
      ]).toArray(),
      
      // Pending orders (assigned but not picked up yet)
      Parcel.countDocuments({
        assignedRiderId: riderObjectId,
        status: { 
          $in: [
            'pending_rider_approval',
            'awaiting_pickup'
          ]
        }
      }),
      
      // Recent deliveries (last 10)
      Parcel.find({ 
        assignedRiderId: riderObjectId 
      })
      .sort({ updatedAt: -1 })
      .limit(10)
      .toArray(),
      
      // Overall stats (lifetime)
      Parcel.aggregate([
        {
          $match: {
            assignedRiderId: riderObjectId
          }
        },
        {
          $group: {
            _id: null,
            totalDeliveries: { $sum: 1 },
            successfulDeliveries: {
              $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
            },
            cancelledDeliveries: {
              $sum: { 
                $cond: [
                  { $in: ['$status', ['cancelled', 'returned']] }, 
                  1, 
                  0
                ] 
              }
            }
          }
        }
      ]).toArray(),
      
      // Total lifetime earnings (all delivered parcels)
      Parcel.aggregate([
        {
          $match: {
            assignedRiderId: riderObjectId,
            status: 'delivered'
          }
        },
        {
          $project: {
            riderEarning: {
              $reduce: {
                input: '$earnings.riders',
                initialValue: 0,
                in: {
                  $cond: [
                    { 
                      $and: [
                        { $eq: ['$$this.riderId', riderObjectId] },
                        { $eq: ['$$this.earned', true] }
                      ]
                    },
                    { $add: ['$$value', '$$this.amount'] },
                    '$$value'
                  ]
                }
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$riderEarning' }
          }
        }
      ]).toArray()
    ]);

    // Calculate stats
    const stats = overallStats[0] || { 
      totalDeliveries: 0, 
      successfulDeliveries: 0,
      cancelledDeliveries: 0
    };

    const successRate = stats.totalDeliveries > 0 
      ? ((stats.successfulDeliveries / stats.totalDeliveries) * 100).toFixed(1)
      : 0;

    // Calculate rating from profile or use success rate
    const averageRating = riderProfile?.rating?.average || 
      (stats.totalDeliveries > 0
        ? Math.min(5, 3 + (parseFloat(successRate) / 25)).toFixed(1)
        : 0);

    // Calculate points (e.g., 10 points per successful delivery)
    const totalPoints = stats.successfulDeliveries * 10;

    // Response data
    const overviewData = {
      rider: {
        name: riderProfile?.name || 'Rider',
        email: riderProfile?.email,
        phone: riderProfile?.phone,
        district: riderProfile?.district,
        workingStatus: riderProfile?.working_status || 'off_duty',
        profileImage: riderProfile?.profileImage
      },
      
      // Real-time stats for TODAY
      todayStats: {
        activeDeliveries: activeDeliveries.length,
        completedToday: todayDelivered,
        pendingPickup: pendingOrders,
        earnedToday: todayEarnings[0]?.total || 0
      },
      
      // Overall lifetime stats (calculated on-the-fly)
      overallStats: {
        totalDeliveries: stats.totalDeliveries,
        successfulDeliveries: stats.successfulDeliveries,
        cancelledDeliveries: stats.cancelledDeliveries,
        totalEarnings: totalEarnings[0]?.total || 0,
        successRate: parseFloat(successRate),
        averageRating: parseFloat(averageRating),
        totalPoints: totalPoints
      },
      
      // Active deliveries list
      activeDeliveries: activeDeliveries.map(parcel => ({
        id: parcel._id.toString(),
        parcelId: parcel.parcelId,
        trackingId: parcel.trackingId,
        status: parcel.status,
        senderName: parcel.senderName,
        receiverName: parcel.receiverName,
        deliveryAddress: parcel.deliveryAddress,
        deliveryDistrict: parcel.deliveryDistrict,
        pickupAddress: parcel.pickupAddress,
        amount: parcel.amount,
        deliveryType: parcel.deliveryType,
        shipmentType: parcel.shipmentType,
        createdAt: parcel.createdAt,
        // Calculate rider's potential earning
        riderEarning: parcel.earnings?.riders?.find(r => 
          r.riderId?.toString() === riderId
        )?.amount || 0
      })),
      
      // Recent deliveries list
      recentDeliveries: recentDeliveries.map(parcel => ({
        id: parcel._id.toString(),
        parcelId: parcel.parcelId,
        trackingId: parcel.trackingId,
        status: parcel.status,
        receiverName: parcel.receiverName,
        amount: parcel.amount,
        date: parcel.updatedAt || parcel.createdAt,
        riderEarning: parcel.earnings?.riders?.find(r => 
          r.riderId?.toString() === riderId
        )?.amount || 0
      }))
    };

    return NextResponse.json({
      success: true,
      data: overviewData
    });

  } catch (error) {
    console.error('Rider overview API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch overview data', details: error.message },
      { status: 500 }
    );
  }
}