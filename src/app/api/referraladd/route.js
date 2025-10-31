import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    // ---------------- Session Check ----------------
    const session = await getServerSession();
    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    // ---------------- Request Body ----------------
    const { name, email } = await req.json();
    if (!name || !email) {
      return new Response(
        JSON.stringify({ message: "Name and email are required" }),
        { status: 400 }
      );
    }

    // ---------------- DB Collections ----------------
    const refCollection = dbConnect("referraluser");
    const usersCollection = dbConnect("users");

    // ---------------- Check if user already exists in users collection ----------------
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: "This person is already in this website" }),
        { status: 400 }
      );
    }

    // ---------------- Duplicate Check in referral collection ----------------
    const existingReferral = await refCollection.findOne({ referredEmail: email });

    if (existingReferral) {
      if (existingReferral.referrerEmail === session.user.email) {
        // Same user already referred
        return new Response(
          JSON.stringify({ message: "You already referred this person" }),
          { status: 400 }
        );
      } else {
        // Someone else already referred
        return new Response(
          JSON.stringify({ message: "Someone else already referred this person" }),
          { status: 400 }
        );
      }
    }

    // ---------------- Insert New Referral ----------------
    const now = new Date();
    const expireDate = new Date(now);
    expireDate.setDate(expireDate.getDate() + 30);

    const referralDoc = {
      referrerEmail: session.user.email,
      referredName: name,
      referredEmail: email,
      referralStatus: "Pending",
      referDate: now,
      expireDate,
      dateLeft: 30,
      dateOver: 0,
      isJoined: false
    };

    await refCollection.insertOne(referralDoc);

    // ---------------- Nodemailer setup ----------------
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    const mailOptions = {
      from: `"Referral Program" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 You've been invited!",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
          <h2 style="color: #6b21a8;">Hello ${name},</h2>
          <p>Your friend <b>${session.user.email}</b> has invited you to join our website!</p>
          <p>Join within <b>30 days</b> and earn amazing rewards!</p>
          <a href="https://ezi-drop.vercel.app/" 
             style="display:inline-block; padding:10px 20px; background-color:#6b21a8; color:#fff; text-decoration:none; border-radius:5px;">
            Join Now
          </a>
          <p style="margin-top:20px; font-size:0.9rem; color:#555;">
            If you didn’t expect this email, you can safely ignore it.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({
        message: "Referral added successfully and email sent!",
        data: referralDoc,
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    );
  }
}
