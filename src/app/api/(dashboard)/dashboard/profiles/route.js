// /app/api/dashboard/profiles/route.js
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
    const Order = dbConnect("parcels");

    if (session.user.role === 'admin') {
      // Admin sees district admins
      const districtAdmins = await User.find({ 
        role: 'district_admin' 
      }).toArray();

      // Get order statistics for each district admin
      const profilesWithStats = await Promise.all(
        districtAdmins.map(async (admin) => {
          const [totalOrders, deliveredOrders] = await Promise.all([
            Order.countDocuments({ pickupDistrictId: admin.districtId }),
            Order.countDocuments({ 
              pickupDistrictId: admin.districtId, 
              status: 'delivered' 
            })
          ]);

          const deliveryRate = totalOrders > 0 
            ? ((deliveredOrders / totalOrders) * 100).toFixed(1) 
            : 0;

          return {
            id: admin._id.toString(),
            userId: admin.userId,
            name: admin.name || 'Unnamed Admin',
            email: admin.email,
            phone: admin.phone,
            district: admin.districtName || admin.districtId,
            districtId: admin.districtId,
            role: 'District Admin',
            totalOrders,
            deliveredOrders,
            deliveryRate: `${deliveryRate}%`,
            isActive: admin.isActive !== false,
            joinedDate: admin.createdAt,
            lastActive: admin.lastLogin || admin.updatedAt
          };
        })
      );

      // Sort by total orders
      profilesWithStats.sort((a, b) => b.totalOrders - a.totalOrders);

      return NextResponse.json({
        success: true,
        type: 'district_admins',
        data: profilesWithStats.slice(0, 10) // Top 10
      });

    } else if (session.user.role === 'district_admin') {
      // District admin sees top riders in their district
      const riders = await User.find({ 
        role: 'rider',
        districtId: session.user.districtId
      }).toArray();

      // Get delivery statistics for each rider
      const profilesWithStats = await Promise.all(
        riders.map(async (rider) => {
          const [totalAssigned, delivered, pending] = await Promise.all([
            Order.countDocuments({ assignedRiderId: rider._id }),
            Order.countDocuments({ 
              assignedRiderId: rider._id, 
              status: 'delivered' 
            }),
            Order.countDocuments({ 
              assignedRiderId: rider._id,
              status: { 
                $in: [
                  'in_transit_to_warehouse',
                  'at_local_warehouse',
                  'awaiting_pickup_from_warehouse'
                ]
              }
            })
          ]);

          const successRate = totalAssigned > 0 
            ? ((delivered / totalAssigned) * 100).toFixed(1) 
            : 0;

          // Calculate rating (mock for now, can be replaced with actual rating system)
          const rating = totalAssigned > 0 
            ? Math.min(5, 3 + (parseFloat(successRate) / 25)).toFixed(1)
            : 0;

          return {
            id: rider._id.toString(),
            userId: rider.userId,
            name: rider.name || 'Unnamed Rider',
            email: rider.email,
            phone: rider.phone,
            district: rider.districtName || rider.districtId,
            role: 'Rider',
            totalAssigned,
            delivered,
            pending,
            successRate: `${successRate}%`,
            rating: parseFloat(rating),
            isActive: rider.isActive !== false,
            vehicleType: rider.vehicleType || 'Bike',
            joinedDate: rider.createdAt,
            lastActive: rider.lastLogin || rider.updatedAt
          };
        })
      );

      // Sort by delivered count
      profilesWithStats.sort((a, b) => b.delivered - a.delivered);

      return NextResponse.json({
        success: true,
        type: 'riders',
        data: profilesWithStats.slice(0, 10) // Top 10
      });
    }

    return NextResponse.json({ error: 'Invalid role' }, { status: 403 });

  } catch (error) {
    console.error('Profiles error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}