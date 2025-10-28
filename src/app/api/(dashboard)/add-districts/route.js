// /app/api/districts/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { dbConnect } from '@/lib/dbConnect';
import { authOptions } from '@/lib/authOptions';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { districtName, districtId, subDistricts, warehouseAddress, warehouseEmail, coords } = body;

    // Validation
    if (!districtName || !districtId || !subDistricts || subDistricts.length === 0) {
      return NextResponse.json(
        { error: 'District name, ID, and at least one sub-district are required' },
        { status: 400 }
      );
    }

    if (!warehouseAddress || !warehouseEmail) {
      return NextResponse.json(
        { error: 'Warehouse address and contact email are required' },
        { status: 400 }
      );
    }

    const District = dbConnect("districts");
    const Warehouse = dbConnect("wirehouses");

    // Check if district already exists
    const existingDistrict = await District.findOne({ districtId });
    if (existingDistrict) {
      return NextResponse.json(
        { error: 'District ID already exists' },
        { status: 400 }
      );
    }

    // Prepare district data
    const districtData = {
      district: districtName,
      districtId: districtId,
      subDistricts: subDistricts,
      createdAt: new Date(),
      createdBy: session.user.userId
    };

    // Prepare warehouse data
    const warehouseData = {
      wirehouseId: districtId, // Using same ID for warehouse
      address: warehouseAddress,
      contactEmail: warehouseEmail,
      coords: coords || [0, 0], // Default coords if not provided
      districtId: districtId,
      createdAt: new Date(),
      createdBy: session.user.userId
    };

    // Insert both documents
    const [districtResult, warehouseResult] = await Promise.all([
      District.insertOne(districtData),
      Warehouse.insertOne(warehouseData)
    ]);

    return NextResponse.json({
      success: true,
      message: 'District and warehouse added successfully',
      data: {
        districtId: districtResult.insertedId,
        warehouseId: warehouseResult.insertedId
      }
    });

  } catch (error) {
    console.error('Error adding district:', error);
    return NextResponse.json(
      { error: 'Failed to add district' },
      { status: 500 }
    );
  }
}