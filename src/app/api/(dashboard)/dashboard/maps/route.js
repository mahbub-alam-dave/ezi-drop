// /app/api/dashboard/geographic-stats/route.js
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
    const District = dbConnect("districts");
    
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const districtId = searchParams.get('districtId'); // Get selected district from query
    
    const dateFilter = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    console.log('Session user:', session?.user);
    console.log('Selected district:', districtId);

    // Determine the effective district to query
    let effectiveDistrictId = null;
    
    if (session?.user?.role === 'admin') {
      // Admin can filter by district or see all
      effectiveDistrictId = (districtId && districtId !== 'all') ? districtId : null;
    } else if (session?.user?.role === 'district_admin') {
      // District admin always sees their own district
      effectiveDistrictId = session.user.districtId;
    }

    // If no specific district is selected (admin viewing all districts)
    if (!effectiveDistrictId) {
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
        activeDistricts: districtStats.length,
        viewLevel: 'country'
      });
    }

    // If a specific district is selected (admin filtered by district OR district_admin)
    const districtFilter = {
      ...dateFilter,
      pickupDistrictId: effectiveDistrictId
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
      District.findOne({ districtId: effectiveDistrictId })
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
      districtName: districtInfo?.district || effectiveDistrictId,
      districtId: effectiveDistrictId,
      totalUpazilas: upazilaStats.length,
      viewLevel: 'district'
    });

  } catch (error) {
    console.error('Geographic stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch geographic stats' },
      { status: 500 }
    );
  }
}