import express from 'express';
import {
  createOrder,
  verifyPayment,
  getDonation,
  getAllDonations,
} from '../Components/DonationComponents.js';

const Donationrouter = express.Router();

Donationrouter.post('/create-order', createOrder);
Donationrouter.post('/verify-payment', verifyPayment);
Donationrouter.get('/donation/:orderId', getDonation);
Donationrouter.get('/donations', getAllDonations);

export default Donationrouter;
