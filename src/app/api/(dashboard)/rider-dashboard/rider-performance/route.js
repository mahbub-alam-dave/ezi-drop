// /app/api/rider/performance/route.js
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
    
    // Get date range from query params (default: last 6 months)
    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get('months') || '6');
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    // Fetch rider profile
    const riderProfile = await User.findOne({ _id: riderObjectId });

    // Monthly aggregation with rider earnings
    const monthlyData = await Parcel.aggregate([
      {
        $match: {
          assignedRiderId: riderObjectId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $addFields: {
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
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          deliveries: { $sum: 1 },
          success: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          amount: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, '$riderEarning', 0] }
          },
          points: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 10, 0] }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $project: {
          _id: 0,
          month: {
            $let: {
              vars: {
                monthsInString: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
              },
              in: { $arrayElemAt: ['$$monthsInString', '$_id.month'] }
            }
          },
          year: '$_id.year',
          deliveries: 1,
          success: 1,
          amount: 1,
          points: 1
        }
      }
    ]).toArray();

    // Daily data for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const dailyData = await Parcel.aggregate([
      {
        $match: {
          assignedRiderId: riderObjectId,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $addFields: {
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
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          deliveries: { $sum: 1 },
          success: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          },
          amount: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, '$riderEarning', 0] }
          },
          points: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 10, 0] }
          }
        }
      },
      {
        $sort: { '_id': 1 }
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          deliveries: 1,
          successRate: {
            $cond: [
              { $eq: ['$deliveries', 0] },
              0,
              { $multiply: [{ $divide: ['$success', '$deliveries'] }, 100] }
            ]
          },
          amount: 1,
          points: 1
        }
      }
    ]).toArray();

    // Overall stats
    const overallStats = await Parcel.aggregate([
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
    ]).toArray();

    // Total earnings
    const totalEarningsData = await Parcel.aggregate([
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
    ]).toArray();

    // Get ratings from delivered parcels (if you store ratings in parcels)
    const ratingsData = await Parcel.aggregate([
      {
        $match: {
          assignedRiderId: riderObjectId,
          status: 'delivered',
          'rating.value': { $exists: true }
        }
      },
      {
        $project: {
          rating: '$rating.value'
        }
      },
      {
        $sort: { _id: -1 }
      },
      {
        $limit: 100
      }
    ]).toArray();

    const ratings = ratingsData.map(r => r.rating);
    const averageRating = ratings.length > 0
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
      : riderProfile?.rating?.average || 0;

    const stats = overallStats[0] || {
      totalDeliveries: 0,
      successfulDeliveries: 0,
      cancelledDeliveries: 0
    };

    const totalPoints = stats.successfulDeliveries * 10;

    // Performance data response
    const performanceData = {
      totalDeliveries: stats.totalDeliveries,
      successfulDeliveries: stats.successfulDeliveries,
      cancelledDeliveries: stats.cancelledDeliveries,
      totalPoints: totalPoints,
      averageRating: parseFloat(averageRating),
      totalEarnings: totalEarningsData[0]?.total || 0,
      ratings,
      monthly: monthlyData,
      daily: dailyData
    };

    return NextResponse.json({
      success: true,
      data: performanceData
    });

  } catch (error) {
    console.error('Rider performance API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch performance data', details: error.message },
      { status: 500 }
    );
  }
}