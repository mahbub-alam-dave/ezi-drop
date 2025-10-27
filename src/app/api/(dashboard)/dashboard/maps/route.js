// /app/api/dashboard/geographic-stats/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { dbConnect } from '@/lib/dbConnect';

export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const Order = dbConnect("parcels");
    const District = dbConnect("districts");
    
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const dateFilter = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    if (session.user.role === 'admin') {
      // Admin sees all districts
      const [districtStats, districts] = await Promise.all([
        Order.aggregate([
          { $match: dateFilter },
          {
            $group: {
              _id: '$pickupDistrictId',
              districtName: { $first: '$pickupDistrict' },
              totalOrders: { $sum: 1 },
              delivered: {
                $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
              },
              pending: {
                $sum: {
                  $cond: [
                    { $in: ['$status', ['not_picked', 'pending_rider_approval', 'awaiting_pickup']] },
                    1,
                    0
                  ]
                }
              },
              inTransit: {
                $sum: {
                  $cond: [
                    { $in: ['$status', ['in_transit_to_warehouse', 'at_local_warehouse', 'awaiting_pickup_from_warehouse']] },
                    1,
                    0
                  ]
                }
              },
              revenue: { $sum: '$amount' }
            }
          },
          { $sort: { totalOrders: -1 } }
        ]).toArray(),
        District.find({}).toArray()
      ]);

      // Enrich with district info
      const enrichedStats = districtStats.map(stat => ({
        id: stat._id,
        name: stat.districtName || stat._id,
        totalOrders: stat.totalOrders,
        delivered: stat.delivered,
        pending: stat.pending,
        inTransit: stat.inTransit,
        revenue: stat.revenue,
        deliveryRate: stat.totalOrders > 0 
          ? Math.round((stat.delivered / stat.totalOrders) * 100) 
          : 0
      }));

      return NextResponse.json({
        type: 'districts',
        data: enrichedStats,
        totalDistricts: districts.length,
        activeDistricts: districtStats.length
      });

    } else if (session.user.role === 'district_admin') {
      // District admin sees upazilas (zones) within their district
      const districtFilter = {
        ...dateFilter,
        pickupDistrictId: session.user.districtId
      };

      const [upazilaStats, districtInfo] = await Promise.all([
        Order.aggregate([
          { $match: districtFilter },
          {
            $group: {
              _id: '$pickupUpazila', // Group by upazila
              totalOrders: { $sum: 1 },
              delivered: {
                $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
              },
              pending: {
                $sum: {
                  $cond: [
                    { $in: ['$status', ['not_picked', 'pending_rider_approval', 'awaiting_pickup']] },
                    1,
                    0
                  ]
                }
              },
              inTransit: {
                $sum: {
                  $cond: [
                    { $in: ['$status', ['in_transit_to_warehouse', 'at_local_warehouse', 'awaiting_pickup_from_warehouse']] },
                    1,
                    0
                  ]
                }
              },
              revenue: { $sum: '$amount' }
            }
          },
          { $sort: { totalOrders: -1 } }
        ]).toArray(),
        District.findOne({ districtId: session.user.districtId })
      ]);

      const enrichedStats = upazilaStats.map(stat => ({
        id: stat._id || 'unassigned',
        name: stat._id || 'Unassigned Upazila',
        totalOrders: stat.totalOrders,
        delivered: stat.delivered,
        pending: stat.pending,
        inTransit: stat.inTransit,
        revenue: stat.revenue,
        deliveryRate: stat.totalOrders > 0 
          ? Math.round((stat.delivered / stat.totalOrders) * 100) 
          : 0
      }));

      return NextResponse.json({
        type: 'upazilas',
        data: enrichedStats,
        districtName: districtInfo?.district || session.user.districtId,
        totalUpazilas: upazilaStats.length
      });
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 403 });

  } catch (error) {
    console.error('Geographic stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch geographic stats' },
      { status: 500 }
    );
  }
}