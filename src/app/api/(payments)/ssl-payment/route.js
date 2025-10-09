import { dbConnect } from "@/lib/dbConnect";
import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      parcelId,
    } = body;

    const parcelData = await dbConnect("parcels").findOne({parcelId})
    const amount = parcelData.amount;

    const data = {
      store_id: process.env.STORE_ID,
      store_passwd: process.env.STORE_PASS,
      total_amount: amount,
      currency: "BDT",
      tran_id: "TRAN_" + new Date().getTime(),
      success_url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/payment-success`,
      fail_url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/payment/fail`,
      cancel_url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/payment/cancel`,
      ipn_url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/ipn`,
      shipping_method: "NO",
      product_name: "Test Product",
      product_category: "Test",
      product_profile: "general",
      cus_name: customer_name || null,
      cus_email: customer_email || null,
      cus_add1: customer_address || "Customer Address",
      cus_city: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: customer_phone || null,
      cus_fax: "",
      multi_card_name: "mastercard,visacard,amex",
      value_a: parcelId,
      value_b: "ref002",
      value_c: "ref003",
      value_d: "ref004",
    };
// https://sandbox.sslcommerz.com/gwprocess/v4/api.php
    const response = await axios.post(
      "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
      new URLSearchParams(data).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}