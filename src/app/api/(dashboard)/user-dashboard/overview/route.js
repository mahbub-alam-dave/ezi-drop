// /app/api/user/overview/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { dbConnect } from '@/lib/dbConnect';
import { authOptions } from '@/lib/authOptions';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'user') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const Parcel = dbConnect("parcels");
    const User = dbConnect("users");
    
    // Get user ID from session - adjust based on your auth setup
    const userId = session.user.userId || session.user.id;
    const userEmail = session.user.email;
    
    // Date ranges
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Fetch user profile
    const userProfile = await User.findOne({ 
      $or: [
        { _id: new ObjectId(userId) },
        { email: userEmail }
      ]
    });

    // Fetch all data in parallel
    const [
      totalDeliveries,
      pendingOrders,
      inTransitOrders,
      deliveredOrders,
      scheduledPickups,
      totalSpent,
      lastWeekStats,
      lastMonthStats,
      recentActivities,
      supportTickets
    ] = await Promise.all([
      // Total deliveries (all parcels sent by user)
      Parcel.countDocuments({
        senderEmail: userEmail
      }),
      
      // Pending orders (awaiting rider or pickup)
      Parcel.countDocuments({
        senderEmail: userEmail,
        status: { 
          $in: [
            'pending_rider_approval',
            'awaiting_pickup',
            'payment_pending'
          ]
        }
      }),
      
      // In transit orders
      Parcel.countDocuments({
        senderEmail: userEmail,
        status: { 
          $in: [
            'in_transit_to_warehouse',
            'at_local_warehouse',
            'awaiting_pickup_from_warehouse',
            'out_for_delivery'
          ]
        }
      }),
      
      // Delivered orders
      Parcel.countDocuments({
        senderEmail: userEmail,
        status: 'delivered'
      }),
      
      // Scheduled pickups (awaiting pickup status)
      Parcel.countDocuments({
        senderEmail: userEmail,
        status: 'awaiting_pickup'
      }),
      
      // Total amount spent (all paid parcels)
      Parcel.aggregate([
        {
          $match: {
            senderEmail: userEmail,
            payment: 'done'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]).toArray(),
      
      // Last week stats
      Parcel.aggregate([
        {
          $match: {
            senderEmail: userEmail,
            createdAt: { $gte: lastWeek }
          }
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            spent: { $sum: '$amount' }
          }
        }
      ]).toArray(),
      
      // Last month stats
      Parcel.aggregate([
        {
          $match: {
            senderEmail: userEmail,
            createdAt: { $gte: lastMonth }
          }
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            spent: { $sum: '$amount' }
          }
        }
      ]).toArray(),
      
      // Recent activities (last 10 parcels with status changes)
      Parcel.find({
        senderEmail: userEmail
      })
      .sort({ updatedAt: -1 })
      .limit(10)
      .toArray(),
      
      // Support tickets - if you have a support collection
      // Otherwise, we'll create mock data or skip
      Promise.resolve([]) // Placeholder for support tickets
    ]);

    // Calculate percentage changes
    const lastWeekCount = lastWeekStats[0]?.count || 0;
    const lastMonthCount = lastMonthStats[0]?.count || 0;
    const previousWeekCount = lastMonthCount - lastWeekCount;
    
    const deliveryChange = previousWeekCount > 0 
      ? (((lastWeekCount - previousWeekCount) / previousWeekCount) * 100).toFixed(0)
      : '+0';

    // Calculate satisfaction rate (based on delivered vs total)
    const satisfactionRate = totalDeliveries > 0
      ? ((deliveredOrders / totalDeliveries) * 100).toFixed(0)
      : 100;

    // Current balance (total spent - refunds, if you track refunds)
    const currentBalance = totalSpent[0]?.total || 0;

    // Completed payments (delivered orders)
    const completedPayments = deliveredOrders;

    // Calculate pending payments
    const pendingPayments = await Parcel.aggregate([
      {
        $match: {
          senderEmail: userEmail,
          payment: 'pending'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]).toArray();

    // Format recent activities
    const formattedActivities = recentActivities.map(parcel => {
      let action = 'Order Created';
      let status = 'info';
      
      switch(parcel.status) {
        case 'delivered':
          action = 'Delivery Completed';
          status = 'completed';
          break;
        case 'in_transit_to_warehouse':
        case 'out_for_delivery':
          action = 'Order Shipped';
          status = 'processing';
          break;
        case 'awaiting_pickup':
          action = 'Awaiting Pickup';
          status = 'warning';
          break;
        case 'payment_pending':
          action = 'Payment Pending';
          status = 'warning';
          break;
        case 'cancelled':
          action = 'Order Cancelled';
          status = 'cancelled';
          break;
        default:
          action = `Order ${parcel.status.replace(/_/g, ' ')}`;
          status = 'info';
      }
      
      return {
        action,
        status,
        time: getTimeAgo(parcel.updatedAt),
        parcelId: parcel.parcelId,
        trackingId: parcel.trackingId,
        amount: parcel.amount,
        receiverName: parcel.receiverName
      };
    });

    // AI Insight based on user's data
    let aiInsight = "Welcome! Start sending your parcels with us today.";
    
    if (pendingOrders > 3) {
      aiInsight = `You have ${pendingOrders} pending orders. Consider scheduling pickups to speed up delivery.`;
    } else if (inTransitOrders > 0) {
      aiInsight = `You have ${inTransitOrders} packages in transit. Track them for real-time updates.`;
    } else if (scheduledPickups > 0) {
      aiInsight = `${scheduledPickups} pickup${scheduledPickups > 1 ? 's' : ''} scheduled. Our riders will collect soon.`;
    } else if (deliveredOrders > 0) {
      aiInsight = "Great! Your deliveries are on track. Ready to send more parcels?";
    }

    // Response data
    const overviewData = {
      user: {
        name: userProfile?.name || session.user.name,
        email: userProfile?.email || userEmail,
        phone: userProfile?.phone,
        points: userProfile?.points || 0,
        profileImage: userProfile?.profileImage
      },
      
      metrics: [
        {
          title: 'My Deliveries',
          value: totalDeliveries.toString(),
          change: deliveryChange >= 0 ? `+${deliveryChange}%` : `${deliveryChange}%`,
          icon: '📦',
          color: 'from-blue-500 to-blue-600'
        },
        {
          title: 'Pending Orders',
          value: pendingOrders.toString(),
          change: pendingOrders > 0 ? '-1%' : '0%',
          icon: '⏱️',
          color: 'from-yellow-500 to-yellow-600'
        },
        {
          title: 'Satisfaction Rate',
          value: `${satisfactionRate}%`,
          change: '+1%',
          icon: '⭐',
          color: 'from-purple-500 to-purple-600'
        },
        {
          title: 'Current Balance',
          value: `৳${currentBalance.toLocaleString()}`,
          change: lastWeekStats[0]?.spent ? `+${((lastWeekStats[0].spent / currentBalance) * 100).toFixed(0)}%` : '+0%',
          icon: '💰',
          color: 'from-amber-500 to-amber-600'
        },
        {
          title: 'Scheduled Pickups',
          value: scheduledPickups.toString(),
          change: scheduledPickups > 0 ? '+2%' : '0%',
          icon: '🛻',
          color: 'from-teal-500 to-teal-600'
        },
        {
          title: 'Completed Payments',
          value: completedPayments.toString(),
          change: deliveredOrders > 0 ? '+8%' : '0%',
          icon: '✅',
          color: 'from-green-500 to-green-600'
        }
      ],
      
      recentActivities: formattedActivities,
      
      supportTickets: supportTickets.length > 0 ? supportTickets : [
        // Mock data if no support collection exists
        // Remove this when you implement support tickets
      ],
      
      billingSummary: {
        totalSpent: currentBalance,
        refunds: 0, // Implement if you track refunds
        pendingPayments: pendingPayments[0]?.total || 0
      },
      
      aiInsight,
      
      // Additional stats
      stats: {
        inTransit: inTransitOrders,
        delivered: deliveredOrders,
        total: totalDeliveries
      }
    };

    return NextResponse.json({
      success: true,
      data: overviewData
    });

  } catch (error) {
    console.error('User overview API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch overview data',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' year' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' month' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' day' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hour' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minute' + (Math.floor(interval) > 1 ? 's' : '') + ' ago';
  
  return 'Just now';
}