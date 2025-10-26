// /app/api/dashboard/stats/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
/* import Order from '@/models/Order';
import User from '@/models/User';
import Rider from '@/models/Rider'; */

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const User = dbConnect("users");
    const Rider = dbConnect("users");
    const Order = dbConnect("Parcels");
    
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
    
    const districtFilter = districtId && districtId !== 'all' 
      ? { districtId } 
      : {};
    
    // Check user role and apply district restriction for district_admin
    if (session.user.role === 'district_admin') {
      districtFilter.districtId = session.user.districtId;
    }
    
    const queryFilter = { ...dateFilter, ...districtFilter };
    
    // Fetch all stats in parallel
    const [
      totalOrders,
      deliveredOrders,
      pendingOrders,
      cancelledOrders,
      revenueData,
      totalRiders,
      totalUsers,
      previousPeriodOrders
    ] = await Promise.all([
      Order.countDocuments(queryFilter),
      Order.countDocuments({ ...queryFilter, status: 'delivered' }),
      Order.countDocuments({ ...queryFilter, status: 'pending' }),
      Order.countDocuments({ ...queryFilter, status: 'cancelled' }),
      Order.aggregate([
        { $match: queryFilter },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Rider.countDocuments({...districtFilter, role:'rider'}),
    //   User.countDocuments({ ...districtFilter,  }),
    User.countDocuments({
  ...districtFilter,
  role: { $nin: ["rider", "district_admin", "admin"] }
}),
      // Previous period for trend calculation
      Order.countDocuments({
        ...districtFilter,
        createdAt: {
          $gte: new Date(new Date(startDate) - (new Date(endDate) - new Date(startDate))),
          $lt: new Date(startDate)
        }
      })
    ]);
    
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