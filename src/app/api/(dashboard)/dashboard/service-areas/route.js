// /app/api/dashboard/service-areas/route.js
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

    if (session.user.role === 'admin') {
      // Get all districts with order statistics
      const [districts, districtStats] = await Promise.all([
        District.find({}).toArray(),
        Order.aggregate([
          {
            $group: {
              _id: '$pickupDistrictId',
              totalOrders: { $sum: 1 },
              upazilas: { $addToSet: '$pickupUpazila' }
            }
          }
        ]).toArray()
      ]);

      // Merge data
      const serviceAreas = districts.map(district => {
        const stats = districtStats.find(s => s._id === district.districtId);
        return {
          id: district.districtId,
          name: district.district,
          type: 'district',
          totalOrders: stats?.totalOrders || 0,
          upazilasCount: stats?.upazilas?.filter(u => u).length || 0,
          status: stats?.totalOrders > 0 ? 'active' : 'inactive',
          // Placeholder for future features
          hasCustomPricing: false,
          hasRadiusSet: false
        };
      });

      return NextResponse.json({
        type: 'districts',
        data: serviceAreas.sort((a, b) => b.totalOrders - a.totalOrders)
      });

    } else if (session.user.role === 'district_admin') {
      // Get upazilas within district
      const [districtInfo, upazilaStats] = await Promise.all([
        District.findOne({ districtId: session.user.districtId }),
        Order.aggregate([
          { $match: { pickupDistrictId: session.user.districtId } },
          {
            $group: {
              _id: '$pickupUpazila',
              totalOrders: { $sum: 1 },
              lastOrderDate: { $max: '$createdAt' }
            }
          },
          { $sort: { totalOrders: -1 } }
        ]).toArray()
      ]);

      const serviceAreas = upazilaStats.map(upazila => ({
        id: upazila._id,
        name: upazila._id || 'Unassigned',
        type: 'upazila',
        totalOrders: upazila.totalOrders,
        lastActivity: upazila.lastOrderDate,
        status: upazila.totalOrders > 10 ? 'active' : 'limited',
        // Placeholder for future features
        hasCustomPricing: false,
        hasRadiusSet: false
      }));

      return NextResponse.json({
        type: 'upazilas',
        districtName: districtInfo?.district || session.user.districtId,
        data: serviceAreas
      });
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 403 });

  } catch (error) {
    console.error('Service areas error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service areas' },
      { status: 500 }
    );
  }
}