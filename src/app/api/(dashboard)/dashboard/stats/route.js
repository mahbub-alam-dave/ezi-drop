// /app/api/dashboard/stats/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { dbConnect } from '@/lib/dbConnect';
/* import Order from '@/models/Order';
import User from '@/models/User';
import Rider from '@/models/Rider'; */

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // await dbConnect();
    const User = dbConnect("users");
    const Rider = dbConnect("users");
    const Order = dbConnect("parcels");
    
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get('districtId'); // null for 'all'
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Build query filters
    const dateFilter = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
    
const orderDistrictFilter = districtId && districtId !== 'all'
  ? { pickupDistrictId: districtId }
  : {};

// Apply district restriction for district_admin
if (session.user.role === 'district_admin') {
  orderDistrictFilter.pickupDistrictId = session.user.districtId;
}

// ✅ 2. District filter for Users/Riders (uses districtId)
const userDistrictFilter = districtId && districtId !== 'all'
  ? { districtId }
  : {};

if (session.user.role === 'district_admin') {
  userDistrictFilter.districtId = session.user.districtId;
}

    
    const queryFilter = { ...dateFilter, ...orderDistrictFilter };
    
    // Fetch all stats in parallel
    const [
      totalOrders,
      deliveredOrders,
      pendingOrders,
      inTransitOrders,
      cancelledOrders,
      revenueData,
      totalRiders,
      totalUsers,
      previousPeriodOrders
    ] = await Promise.all([
      Order.countDocuments(queryFilter),
      Order.countDocuments({ ...queryFilter, status: 'delivered' }),
      // Order.countDocuments({ ...queryFilter, status: 'pending' }),
      Order.countDocuments({ ...queryFilter, status: { $in: ["not_picked", "pending_rider_approval", "awaiting_pickup" ]} }),
      Order.countDocuments({ ...queryFilter, status: { $in: ["in_transit_to_warehouse", "at_local_warehouse", "awaiting_pickup_from_warehouse" ]} }),
      Order.countDocuments({ ...queryFilter, status: 'cancelled' }),
      Order.aggregate([
        { $match: queryFilter },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray(),
      Rider.countDocuments({...userDistrictFilter, role:'rider'}),
    //   User.countDocuments({ ...districtFilter,  }),
    User.countDocuments({
  ...userDistrictFilter,
  role: { $nin: ["rider", "district_admin", "admin"] }
}),
      // Previous period for trend calculation
      Order.countDocuments({
        ...queryFilter,
        createdAt: {
          $gte: new Date(new Date(startDate) - (new Date(endDate) - new Date(startDate))),
          $lt: new Date(startDate)
        }
      })
    ]);

    console.log("Revenue aggregation result:", revenueData);

    
    // Calculate trends
    const orderTrend = previousPeriodOrders > 0 
      ? ((totalOrders - previousPeriodOrders) / previousPeriodOrders) * 100 
      : 0;
    
    const stats = {
      totalOrders: { count: totalOrders, trend: orderTrend },
      deliveredOrders: { count: deliveredOrders, trend: 0 },
      pendingOrders: { count: pendingOrders, trend: 0 },
      cancelledOrders: { count: cancelledOrders, trend: 0 },
      totalRevenue: { 
        amount: revenueData[0]?.total || 0, 
        trend: 0 
      },
      totalRiders: { count: totalRiders, active: totalRiders },
      totalUsers: { count: totalUsers, trend: 0 },
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}