import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function PUT(req, { params }) {
  try {
    const parcels = await dbConnect("parcels");
    const riders = await dbConnect("rider-applications");

    // Parcel খুঁজে বের করো
    const parcel = await parcels.findOne({ _id: new ObjectId(params.id) });
    if (!parcel) {
      return NextResponse.json(
        { message: "Parcel not found" },
        { status: 404 }
      );
    }

    // Rider auto-assign
    let rider = await riders.findOne({ district: parcel.pickupDistrict });
    if (!rider) {
      const allRiders = await riders.find({}).toArray();
      if (allRiders.length > 0) {
        rider = allRiders[Math.floor(Math.random() * allRiders.length)];
      }
    }

    // Update data
    const updateData = {
      payment: "done",
      paymentAt: new Date(),
    };

    if (rider) {
      updateData.assignedRider = {
        riderId: rider._id,
        riderName: rider.applicantName,
        riderEmail: rider.applicantEmail,
        assignedAt: new Date(),
        status: "pending",
      };
    }

    await parcels.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

   

    // Email HTML
    const htmlContent = `
      <div style="font-family: sans-serif; background-color: #f9fafb; padding: 20px;">
        <div style="max-width: 650px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Payment Successful 🎉</h1>
          </div>
          <div style="padding: 20px;">
            <p>Hello <strong>${parcel.receiverName}</strong>,</p>
            <p>Your parcel payment was successful ✅. Below are your parcel & rider details:</p>
            
            <h3 style="margin-top:20px; color:#111;">📦 Parcel Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              ${generateParcelTable(parcel)}
            </table>

            ${
              rider
                ? `
                <h3 style="margin-top:20px; color:#111;">🛵 Assigned Rider</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                  <tr><td style="padding:8px;border:1px solid #ddd;">Rider Name</td><td style="padding:8px;border:1px solid #ddd;">${rider.applicantName}</td></tr>
                  <tr><td style="padding:8px;border:1px solid #ddd;">Rider Email</td><td style="padding:8px;border:1px solid #ddd;">${rider.applicantEmail}</td></tr>
                  <tr><td style="padding:8px;border:1px solid #ddd;">Mobile</td><td style="padding:8px;border:1px solid #ddd;">${rider.mobileNumber}</td></tr>
                  <tr><td style="padding:8px;border:1px solid #ddd;">District</td><td style="padding:8px;border:1px solid #ddd;">${rider.district}</td></tr>
                </table>
              `
                : `<p><strong>No rider assigned yet.</strong></p>`
            }

            <div style="margin-top: 20px; padding: 10px; background-color: #f3f4f6; border-radius: 6px;">
              <strong>Your percel code:</strong> <span style="color: #4f46e5;">${parcel.parcelId}</span>
            </div>

            <p style="margin-top: 20px;">Thank you for using our service!</p>
            <p style="font-size: 12px; color: gray;">EziDrop Courier Service</p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: parcel.receiverEmail,
      subject: "📦 Your Parcel Payment is Successful - Rider Assigned",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: "Payment updated, rider assigned & email sent",
      assignedRider: rider || null,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Generate random code
function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Table for parcel
function generateParcelTable(parcel) {
  return `
    <tr><td style="padding: 8px; border: 1px solid #ddd;">Sender Name</td><td style="padding: 8px; border: 1px solid #ddd;">${parcel.senderName}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">Sender Email</td><td style="padding: 8px; border: 1px solid #ddd;">${parcel.senderEmail}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">Sender Phone</td><td style="padding: 8px; border: 1px solid #ddd;">${parcel.senderPhone}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">Pickup Address</td><td style="padding: 8px; border: 1px solid #ddd;">${parcel.pickupAddress}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">Receiver Name</td><td style="padding: 8px; border: 1px solid #ddd;">${parcel.receiverName}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">Receiver Email</td><td style="padding: 8px; border: 1px solid #ddd;">${parcel.receiverEmail}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">Parcel Type</td><td style="padding: 8px; border: 1px solid #ddd;">${parcel.parcelType}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">Weight</td><td style="padding: 8px; border: 1px solid #ddd;">${parcel.weight}</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">Cost</td><td style="padding: 8px; border: 1px solid #ddd;">${parcel.cost} BDT</td></tr>
    <tr><td style="padding: 8px; border: 1px solid #ddd;">Parcel Code</td><td style="padding: 8px; border: 1px solid #ddd; color: #4f46e5;">${parcel.parcelId}</td></tr>
  `;
}
