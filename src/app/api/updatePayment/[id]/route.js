import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function PUT(req, { params }) {
  try {
    const collection = await dbConnect("parcels");

    // Parcel data fetch
    const parcel = await collection.findOne({ _id: new ObjectId(params.id) });
    if (!parcel) {
      return NextResponse.json({ message: "Parcel not found" }, { status: 404 });
    }

    // Payment status update
    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { payment: "done", paymentAt: new Date() } }
    );

    if (result.modifiedCount === 1) {
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

      const code = generateCode();

      // Email HTML design
      const htmlContent = `
        <div style="font-family: sans-serif; background-color: #f9fafb; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">Payment Successful 🎉</h1>
            </div>
            <div style="padding: 20px;">
              <p>Hello <strong>${parcel.receiverName}</strong>,</p>
              <p>Your parcel payment was successful.Do not  share your parcel id  without get parcels .  Below are your parcel details:</p>
              <table style="width: 100%; border-collapse: collapse;">
                ${generateParcelTable(parcel, code)}
              </table>
              <div style="margin-top: 20px; padding: 10px; background-color: #f3f4f6; border-radius: 6px;">
                <strong>Your Parcel Code:</strong> <span style="color: #4f46e5;">${parcel.parcelId}</span>
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
        subject: "📦 Your Parcel Payment is Successful",
        html: htmlContent,
      };

      await transporter.sendMail(mailOptions);

      return NextResponse.json({ message: "Payment status updated & email sent" });
    } else {
      return NextResponse.json({ message: "Parcel not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateParcelTable(parcel, code) {
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
