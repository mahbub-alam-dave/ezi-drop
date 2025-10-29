// /app/api/dashboard/billing-details/route.js
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

    const Order = dbConnect("parcels");
    
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const districtId = searchParams.get('districtId');
    
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

    const queryFilter = { ...dateFilter, ...orderDistrictFilter };

    // Fetch detailed billing data
    const [
      deliveredOrders,
      pendingOrders,
      unpaidOrders,
      cancelledOrders,
      revenueByDistrict,
      revenueByStatus,
      dailyRevenue
    ] = await Promise.all([
      // Delivered orders details
      Order.find({
        ...queryFilter,
        status: 'delivered'
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray(),

      // Pending/In-transit orders
      Order.find({
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
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray(),

      // Unpaid orders
      Order.find({
        ...queryFilter,
        $or: [
          { payment: { $exists: false } },
          { payment: 'pending' },
          { payment: { $ne: 'done' } }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray(),

      // Cancelled orders
      Order.find({
        ...queryFilter,
        status: 'cancelled'
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray(),

      // Revenue breakdown by district
      Order.aggregate([
        { $match: { ...queryFilter, status: 'delivered' } },
        {
          $group: {
            _id: '$pickupDistrict',
            revenue: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { revenue: -1 } },
        { $limit: 10 }
      ]).toArray(),

      // Revenue by status
      Order.aggregate([
        { $match: queryFilter },
        {
          $group: {
            _id: '$status',
            amount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]).toArray(),

      // Daily revenue trend
      Order.aggregate([
        { $match: { ...queryFilter, status: 'delivered' } },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            revenue: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]).toArray()
    ]);

    // Calculate totals
    const totals = {
      delivered: {
        count: deliveredOrders.length,
        amount: deliveredOrders.reduce((sum, order) => sum + (order.amount || 0), 0)
      },
      pending: {
        count: pendingOrders.length,
        amount: pendingOrders.reduce((sum, order) => sum + (order.amount || 0), 0)
      },
      unpaid: {
        count: unpaidOrders.length,
        amount: unpaidOrders.reduce((sum, order) => sum + (order.amount || 0), 0)
      },
      cancelled: {
        count: cancelledOrders.length,
        amount: cancelledOrders.reduce((sum, order) => sum + (order.amount || 0), 0)
      }
    };

    return NextResponse.json({
      success: true,
      data: {
        deliveredOrders,
        pendingOrders,
        unpaidOrders,
        cancelledOrders,
        revenueByDistrict,
        revenueByStatus,
        dailyRevenue,
        totals
      }
    });

  } catch (error) {
    console.error('Billing details error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch billing details' },
      { status: 500 }
    );
  }
}