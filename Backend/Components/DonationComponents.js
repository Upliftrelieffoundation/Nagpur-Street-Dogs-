import Razorpay from 'razorpay';
import crypto from 'crypto';
import supabase from '../Utils/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

const hasRazorpayKeys = process.env.RAZORPAY_KEY_ID && 
                         process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id' &&
                         process.env.RAZORPAY_KEY_SECRET &&
                         process.env.RAZORPAY_KEY_SECRET !== 'your_razorpay_key_secret';

let razorpay;

if (hasRazorpayKeys) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn('⚠️ Razorpay environment variables are missing or placeholders. Donations will not work.');
  // Mock object to prevent app crash at load-time
  razorpay = {
    orders: {
      create: () => Promise.reject(new Error('Razorpay is not configured on the server.')),
    }
  };
}

/**
 * CREATE ORDER — creates Razorpay order + stores pending donation in Supabase
 */
async function createOrder(req, res) {
  try {
    const { amount, donorName, donorEmail, donorPhone } = req.body;

    if (!amount || !donorName || !donorEmail || !donorPhone) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const options = {
      amount: amount * 100, // Razorpay needs amount in paise
      currency: 'INR',
      receipt: `donation_${Date.now()}`,
      notes: { donor_name: donorName, donor_email: donorEmail, donor_phone: donorPhone },
    };

    const order = await razorpay.orders.create(options);

    // Store donation record in Supabase (status = 'created')
    const { error } = await supabase.from('donations').insert({
      order_id: order.id,
      amount,
      donor_name: donorName,
      donor_email: donorEmail,
      donor_phone: donorPhone,
      status: 'created',
    });

    if (error) throw error;

    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
}

/**
 * VERIFY PAYMENT — validates Razorpay signature + updates donation status
 */
async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await supabase.from('donations').update({
        payment_id: razorpay_payment_id,
        signature: razorpay_signature,
        status: 'paid',
        updated_at: new Date().toISOString(),
      }).eq('order_id', razorpay_order_id);

      return res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      await supabase.from('donations').update({
        status: 'failed',
        updated_at: new Date().toISOString(),
      }).eq('order_id', razorpay_order_id);

      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
}

/**
 * GET SINGLE DONATION by Razorpay order ID
 */
async function getDonation(req, res) {
  try {
    const { orderId } = req.params;

    const { data: donation, error } = await supabase
      .from('donations')
      .select('order_id, amount, donor_name, donor_email, status, created_at')
      .eq('order_id', orderId)
      .single();

    if (error || !donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    res.json({ success: true, donation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch donation details' });
  }
}

/**
 * GET ALL DONATIONS — paginated (admin use via service role)
 */
async function getAllDonations(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: donations, count, error } = await supabase
      .from('donations')
      .select('order_id, amount, currency, donor_name, donor_email, donor_phone, status, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    res.json({
      success: true,
      donations,
      pagination: { page, limit, total: count, pages: Math.ceil(count / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch donations' });
  }
}

export { createOrder, verifyPayment, getDonation, getAllDonations };
