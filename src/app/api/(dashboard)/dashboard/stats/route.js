// /app/api/dashboard/stats/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { dbConnect } from '@/lib/dbConnect';
import { authOptions } from '@/lib/authOptions';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const User = dbConnect("users");
    const Rider = dbConnect("users");
    const Order = dbConnect("parcels");
    
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get('districtId');
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

    if (session.user.role === 'district_admin') {
      orderDistrictFilter.pickupDistrictId = session.user.districtId;
    }

    const userDistrictFilter = districtId && districtId !== 'all'
      ? { districtId }
      : {};

    if (session.user.role === 'district_admin') {
      userDistrictFilter.districtId = session.user.districtId;
    }
    
    const queryFilter = { ...dateFilter, ...orderDistrictFilter };
    
    // Calculate previous period date range
    const periodDuration = new Date(endDate) - new Date(startDate);
    const previousStartDate = new Date(new Date(startDate) - periodDuration);
    const previousEndDate = new Date(startDate);
    
    const previousDateFilter = {
      createdAt: {
        $gte: previousStartDate,
        $lt: previousEndDate
      }
    };
    
    const previousQueryFilter = { ...previousDateFilter, ...orderDistrictFilter };
    
    // Fetch current period stats
    const [
      totalOrders,
      deliveredOrders,
      pendingOrders,
      inTransitOrders,
      cancelledOrders,
      revenueData,
      totalRiders,
      totalUsers,
      weeklyDeliveries,
      statusBreakdown,
      // Billing-related aggregations
      deliveredRevenue,
      pendingPayoutsData,
      unpaidInvoices,
      cancelledRefunds
    ] = await Promise.all([
      Order.countDocuments(queryFilter),
      Order.countDocuments({ ...queryFilter, status: 'delivered' }),
      Order.countDocuments({ ...queryFilter, status: { $in: ["not_picked", "pending_rider_approval", "awaiting_pickup" ]} }),
      Order.countDocuments({ ...queryFilter, status: { $in: ["in_transit_to_warehouse", "at_local_warehouse", "awaiting_pickup_from_warehouse" ]} }),
      Order.countDocuments({ ...queryFilter, status: 'cancelled' }),
      Order.aggregate([
        { $match: queryFilter },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray(),
      Rider.countDocuments({...userDistrictFilter, role:'rider'}),
      User.countDocuments({
        ...userDistrictFilter,
        role: { $nin: ["rider", "district_admin", "admin"] }
      }),
      // Weekly deliveries aggregation
      Order.aggregate([
        { $match: queryFilter },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]).toArray(),
      // Status breakdown for pie chart
      Order.aggregate([
        { $match: queryFilter },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]).toArray(),
      // Billing: Delivered orders revenue
      Order.aggregate([
        { $match: { ...queryFilter, status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray(),
      // Billing: Pending payouts (in-transit orders)
      Order.aggregate([
        { 
          $match: { 
            ...queryFilter, 
            status: { 
              $in: [
                'not_picked', 
                'pending_rider_approval', 
                'awaiting_pickup',
                'in_transit_to_warehouse', 
                'at_local_warehouse', 
                'awaiting_pickup_from_warehouse'
              ] 
            } 
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray(),
      // Billing: Unpaid invoices
      Order.aggregate([
        { 
          $match: { 
            ...queryFilter, 
            $or: [
              { payment: { $exists: false } },
              { payment: 'pending' },
              { payment: { $ne: 'done' } }
            ]
          } 
        },
        { 
          $group: { 
            _id: null, 
            count: { $sum: 1 },
            total: { $sum: '$amount' } 
          } 
        }
      ]).toArray(),
      // Billing: Cancelled/Refunds
      Order.aggregate([
        { $match: { ...queryFilter, status: 'cancelled' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray()
    ]);

    // Fetch previous period stats for trend calculation
    const [
      prevTotalOrders,
      prevDeliveredOrders,
      prevPendingOrders,
      prevRevenueData,
      prevTotalRiders,
      prevTotalUsers
    ] = await Promise.all([
      Order.countDocuments(previousQueryFilter),
      Order.countDocuments({ ...previousQueryFilter, status: 'delivered' }),
      Order.countDocuments({ ...previousQueryFilter, status: { $in: ["not_picked", "pending_rider_approval", "awaiting_pickup" ]} }),
      Order.aggregate([
        { $match: previousQueryFilter },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]).toArray(),
      Rider.countDocuments({
        ...userDistrictFilter,
        role: 'rider',
        createdAt: { $lt: previousEndDate }
      }),
      User.countDocuments({
        ...userDistrictFilter,
        role: { $nin: ["rider", "district_admin", "admin"] },
        createdAt: { $lt: previousEndDate }
      })
    ]);

    console.log("Revenue aggregation result:", revenueData);

    // Helper function to calculate trend percentage
    const calculateTrend = (current, previous) => {
      if (previous === 0) return current > 0 ? '+100%' : '0%';
      const trend = ((current - previous) / previous) * 100;
      return `${trend >= 0 ? '+' : ''}${trend.toFixed(1)}%`;
    };

    // Calculate all trends
    const orderTrend = calculateTrend(totalOrders, prevTotalOrders);
    const deliveredTrend = calculateTrend(deliveredOrders, prevDeliveredOrders);
    const pendingTrend = calculateTrend(pendingOrders, prevPendingOrders);
    
    const currentRevenue = revenueData[0]?.total || 0;
    const previousRevenue = prevRevenueData[0]?.total || 0;
    const revenueTrend = calculateTrend(currentRevenue, previousRevenue);
    
    const ridersTrend = calculateTrend(totalRiders, prevTotalRiders);
    const usersTrend = calculateTrend(totalUsers, prevTotalUsers);

    // Map day numbers to day names
    const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = Array(7).fill(0).map((_, i) => ({
      day: dayMap[i],
      deliveries: 0,
      color: ['#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'][i]
    }));

    // Fill in actual delivery counts
    weeklyDeliveries.forEach(item => {
      const dayIndex = item._id - 1;
      if (dayIndex >= 0 && dayIndex < 7) {
        weeklyData[dayIndex].deliveries = item.count;
      }
    });

    // Calculate status percentages for pie chart
    const statusMap = {
      'delivered': { name: 'Delivered', color: '#10B981', bg: 'bg-green-500' },
      'in_transit_to_warehouse': { name: 'In Transit', color: '#3B82F6', bg: 'bg-blue-500' },
      'at_local_warehouse': { name: 'In Transit', color: '#3B82F6', bg: 'bg-blue-500' },
      'awaiting_pickup_from_warehouse': { name: 'In Transit', color: '#3B82F6', bg: 'bg-blue-500' },
      'not_picked': { name: 'Pending', color: '#F59E0B', bg: 'bg-yellow-500' },
      'pending_rider_approval': { name: 'Pending', color: '#F59E0B', bg: 'bg-yellow-500' },
      'awaiting_pickup': { name: 'Pending', color: '#F59E0B', bg: 'bg-yellow-500' },
      'cancelled': { name: 'Returned', color: '#EF4444', bg: 'bg-red-500' }
    };

    // Aggregate status counts into categories
    const aggregatedStatus = {
      'Delivered': 0,
      'In Transit': 0,
      'Pending': 0,
      'Returned': 0
    };

    statusBreakdown.forEach(item => {
      const category = statusMap[item._id]?.name;
      if (category) {
        aggregatedStatus[category] += item.count;
      }
    });

    // Convert to percentage
    const statusDataArray = Object.entries(aggregatedStatus).map(([name, count]) => ({
      name,
      value: totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0,
      color: Object.values(statusMap).find(s => s.name === name)?.color || '#94A3B8',
      bg: Object.values(statusMap).find(s => s.name === name)?.bg || 'bg-slate-500'
    })).filter(item => item.value > 0);
    
    const stats = {
      totalOrders: { count: totalOrders, trend: orderTrend },
      deliveredOrders: { count: deliveredOrders, trend: deliveredTrend },
      pendingOrders: { count: pendingOrders, trend: pendingTrend },
      cancelledOrders: { count: cancelledOrders, trend: '0%' },
      inTransitOrders: { count: inTransitOrders, trend: '0%' },
      totalRevenue: { 
        amount: currentRevenue, 
        trend: revenueTrend 
      },
      totalRiders: { count: totalRiders, active: totalRiders, trend: ridersTrend },
      totalUsers: { count: totalUsers, trend: usersTrend },
      weeklyDeliveries: weeklyData,
      statusData: statusDataArray,
      // Billing Summary
      billing: {
        weeklyRevenue: deliveredRevenue[0]?.total || 0,
        pendingPayouts: pendingPayoutsData[0]?.total || 0,
        unpaidInvoices: {
          count: unpaidInvoices[0]?.count || 0,
          amount: unpaidInvoices[0]?.total || 0
        },
        refunds: cancelledRefunds[0]?.total || 0
      }
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