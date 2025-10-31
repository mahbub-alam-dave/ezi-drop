// /app/api/dashboard/activities/route.js
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

    const Parcel = dbConnect("parcels");
    
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get('districtId');
    // const districtId = session?.user?.districtId;
    const limit = parseInt(searchParams.get('limit') || '5');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    // Build district filter based on user role
    let districtFilter = {};
    
    if (session.user.role === 'district_admin') {
      // District admin: only their district
      districtFilter.pickupDistrictId = session.user.districtId;
    } else if (session.user.role === 'admin' && districtId && districtId !== 'all') {
      // Main admin with specific district selected
      districtFilter.pickupDistrictId = districtId;
    }
    // Main admin with 'all': no filter (see everything)

    // Fetch recent activities with events history
    const parcels = await Parcel.find(districtFilter)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray();

    // Get total count for pagination
    const totalCount = await Parcel.countDocuments(districtFilter);

    // Transform parcels into activities
    const activities = [];

    parcels.forEach(parcel => {
      // Get the latest event
      const latestEvent = getLatestEvent(parcel);
      
      if (latestEvent) {
        activities.push({
          id: parcel._id.toString(),
          action: formatAction(parcel.status, latestEvent.type),
          time: getTimeAgo(latestEvent.at || parcel.updatedAt),
          timestamp: latestEvent.at || parcel.updatedAt,
          courier: getCourierInfo(latestEvent, parcel),
          status: getActivityStatus(parcel.status),
          parcelId: parcel.parcelId,
          trackingId: parcel.trackingId,
          district: parcel.pickupDistrict,
          details: {
            senderName: parcel.senderName,
            receiverName: parcel.receiverName,
            amount: parcel.amount,
            currentStatus: parcel.status
          }
        });
      } else {
        // Fallback if no events exist
        activities.push({
          id: parcel._id.toString(),
          action: formatAction(parcel.status, null),
          time: getTimeAgo(parcel.updatedAt),
          timestamp: parcel.updatedAt,
          courier: 'System',
          status: getActivityStatus(parcel.status),
          parcelId: parcel.parcelId,
          trackingId: parcel.trackingId,
          district: parcel.pickupDistrict,
          details: {
            senderName: parcel.senderName,
            receiverName: parcel.receiverName,
            amount: parcel.amount,
            currentStatus: parcel.status
          }
        });
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        activities,
        pagination: {
          total: totalCount,
          limit,
          skip,
          hasMore: skip + limit < totalCount
        }
      }
    });

  } catch (error) {
    console.error('Recent activities API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

// Helper function to get the latest event from parcel
function getLatestEvent(parcel) {
  if (!parcel.events || parcel.events.length === 0) return null;
  
  // Flatten nested events (your structure has nested arrays)
  const flatEvents = parcel.events.flat();
  
  // Sort by timestamp and get the latest
  const sortedEvents = flatEvents
    .filter(e => e && e.at)
    .sort((a, b) => new Date(b.at) - new Date(a.at));
  
  return sortedEvents[0] || null;
}

// Helper function to format action based on status and event
function formatAction(status, eventType) {
  // Event-based actions (more specific)
  if (eventType) {
    const eventActions = {
      'rider_assigned': 'Rider assigned to parcel',
      'post_payment_handled': 'Payment processed',
      'rider_assigned_post_payment': 'Rider assigned after payment',
      'parcel_created': 'New order received',
      'status_changed': 'Status updated',
      'picked_up': 'Package picked up',
      'delivered': 'Package delivered',
      'cancelled': 'Order cancelled'
    };
    
    if (eventActions[eventType]) {
      return eventActions[eventType];
    }
  }
  
  // Status-based actions (fallback)
  const statusActions = {
    'pending_rider_approval': 'Awaiting rider approval',
    'awaiting_pickup': 'Ready for pickup',
    'in_transit_to_warehouse': 'Package in transit to warehouse',
    'at_local_warehouse': 'Package arrived at warehouse',
    'awaiting_pickup_from_warehouse': 'Ready for final delivery',
    'out_for_delivery': 'Package out for delivery',
    'delivered': 'Package delivered successfully',
    'cancelled': 'Order cancelled',
    'returned': 'Package returned',
    'not_picked': 'Pickup pending'
  };
  
  return statusActions[status] || 'Order updated';
}

// Helper function to get courier/actor information
function getCourierInfo(event, parcel) {
  if (!event) return 'System';
  
  // Check if event has 'by' field
  if (event.by) {
    if (event.by === 'system') return 'System';
    if (typeof event.by === 'string') return event.by;
  }
  
  // Check event note for rider name
  if (event.note) {
    const riderMatch = event.note.match(/Rider\s+([A-Za-z\s]+)/i);
    if (riderMatch) return riderMatch[1].trim();
  }
  
  // Fallback to assigned rider or system
  return parcel.assignedRiderId ? 'Assigned Rider' : 'System';
}

// Helper function to determine activity status for badge
function getActivityStatus(parcelStatus) {
  const statusMap = {
    'delivered': 'completed',
    'out_for_delivery': 'processing',
    'in_transit_to_warehouse': 'processing',
    'at_local_warehouse': 'processing',
    'awaiting_pickup_from_warehouse': 'processing',
    'pending_rider_approval': 'warning',
    'awaiting_pickup': 'warning',
    'not_picked': 'warning',
    'cancelled': 'critical',
    'returned': 'critical',
    'payment_pending': 'warning'
  };
  
  return statusMap[parcelStatus] || 'info';
}

// Helper function to calculate time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
}