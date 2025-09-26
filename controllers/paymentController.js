const axios = require("axios");
const crypto = require("crypto");

// PhonePe sandbox credentials
const CLIENT_ID = "TEST-M1LUUA0ENQ1X_250926";
const CLIENT_SECRET = "ZTY2NzhkODYtYzU0Ny00NTRmLWEzMTYtZDBiYTI2MWEyNTMx";
const BASE_URL = "	https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay";


exports.createPayment = async (req, res) => {
  const { order_id, amount, phone } = req.body;

  // Validate input
  if (!order_id || !amount || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // PhonePe expects integer amount in paise
    const payload = {
      merchantId: CLIENT_ID,
      merchantTransactionId: `ORDER-${order_id}`,
      amount: Math.floor(amount * 100), // paise
      redirectUrl: `http://localhost:5173/payment-callback`,
      callbackUrl: `http://localhost:3000/api/payment/phonepe/callback`,
      mobileNumber: phone,
      paymentInstrument: "PAY_PAGE",
    };

    // Generate signature: path + '|' + payload JSON
    const path = "/pg/v1/pay";
    const payloadString = JSON.stringify(payload);
    const signatureString = path + "|" + payloadString;

    const signature = crypto
      .createHmac("sha256", CLIENT_SECRET)
      .update(signatureString)
      .digest("base64");

    const headers = {
      "Content-Type": "application/json",
      "X-VERIFY": signature,
    };

    console.log("Payload to PhonePe:", payload);
    console.log("Signature:", signature);

    // Send request to PhonePe sandbox
    const response = await axios.post(BASE_URL, payload, { headers });

    console.log("PhonePe Response:", response.data);

    if (response.data?.data?.paymentUrl) {
      return res.status(200).json({ paymentUrl: response.data.data.paymentUrl });
    } else {
      console.error("PhonePe did not return payment URL:", response.data);
      return res.status(500).json({ message: "PhonePe did not return payment URL" });
    }
  } catch (err) {
    // Log full error for debugging
    console.error("PhonePe Error:", err.response?.data || err.message);
    return res.status(500).json({
      message: "Failed to create PhonePe payment",
      error: err.response?.data || err.message,
    });
  }
};
