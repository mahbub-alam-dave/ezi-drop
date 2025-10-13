import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { dbConnect } from '@/lib/dbConnect';
import { handlePostPaymentFunctionality } from '@/lib/postPaymentHandler';
import { generateTrackingNumber } from '@/utility/trackingId';


export async function POST(request) {
  let parcelId = ''; // Initialize outside try block for wider scope

  // trackingId
  const trackingId = generateTrackingNumber()

  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);


    // 2. Extract crucial data for validation and update.
    // SSLCommerz often sends custom data back in fields like 'value_a', 'value_b', etc.
    // Ensure 'value_a' matches what you sent in your initiation API (which was 'parcelId').
    const tran_id = data.tran_id;
    parcelId = data.value_a; 
    const paymentStatus = data.status; // e.g., 'VALID' or 'SUCCESS'

    // 3. CRITICAL: Validate the Payment with a Server-to-Server Call
    // ⚠️ You must implement the official SSLCommerz validation here. 
    // This is skipped for brevity, but a *real-world application must do this*.
    if (paymentStatus !== 'VALID' && paymentStatus !== 'SUCCESS') {
      console.error(`Invalid payment status received for Tran ID: ${tran_id}`);
      // Redirect to failure page if payment status is not successful
      return redirect(`/payment/fail?parcelId=${parcelId}`);
    }

    // 4. Update Parcel Status in Database
    // Replace this with your actual database update logic (e.g., Prisma, Mongoose, SQL)
    await dbConnect("parcels").updateOne({parcelId}, {$set: {payment: "done", transactionId: tran_id, trackingId, paymentDate: new Date()}});
    await handlePostPaymentFunctionality(parcelId)
    
    // Log success
    console.log(`Successfully updated parcel ${parcelId} to PAID with Tran ID: ${tran_id}`);

        // Redirect to success page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/payment/success?parcelId=${parcelId}&status=success`,  { status: 302 } 
    );


  } catch (error) {
    console.error('SSLCommerz Success Handling Error:', error.message);
    
    // Redirect to a specific error/fail page, passing the parcelId if available
    // const failUrl = `/payment/fail?parcelId=${parcelId}&error=server_error`;
    
    // Important: Use redirect, as status codes won't change the user's browser view
    // while they are in the middle of a redirect from SSLCommerz.
    // redirect(failUrl); 
        return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/payment/fail?parcelId=${parcelId}&error=server_error`
    );
  }
}
