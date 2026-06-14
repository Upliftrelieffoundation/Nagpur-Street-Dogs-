import React, { useState } from 'react';
import { Heart, Check, X, Loader2, CreditCard, Shield, Users } from 'lucide-react';
import donateIntro from "/home2.png";
import ScrollAnimate from '../Animation/ScrollAnimate';
const volunteerPhotos = [
  "/DONATION PAGE/IMG-20250604-WA0012~2.jpg",
  "/DONATION PAGE/IMG-20250304-WA0025.jpg",
  "/DONATION PAGE/IMG-20250604-WA0119.jpg",
  "/DONATION PAGE/IMG-20241208-WA0207(1).jpg",
  "/DONATION PAGE/IMG-20250603-WA0050~2.jpg",
  "/DONATION PAGE/IMG-20250604-WA0024~2.jpg",
  "/DONATION PAGE/IMG-20250316-WA0015.jpg",
  "/DONATION PAGE/IMG-20241203-WA0058.jpg",
  "/DONATION PAGE/IMG-20250604-WA0006~2.jpg",
  "/DONATION PAGE/IMG-20250304-WA0028.jpg",
  "/DONATION PAGE/IMG-20250604-WA0025.jpg",
  "/DONATION PAGE/IMG-20250604-WA0023.jpg",
  "/DONATION PAGE/IMG-20250604-WA0010~2.jpg",
  "/DONATION PAGE/IMG-20250604-WA0130.jpg",
  "/DONATION PAGE/IMG-20250604-WA0120.jpg",
];

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [donorDetails, setDonorDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [paymentStatus, setPaymentStatus] = useState(null);

  const predefinedAmounts = [50, 100, 200, 500, 1000, 5000];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  const getCurrentAmount = () => {
    return selectedAmount || parseInt(customAmount) || 0;
  };

  const handleDonateClick = () => {
    const amount = getCurrentAmount();
    if (amount > 0) {
      setShowForm(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDonorDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const amount = getCurrentAmount();
    const { name, email, phone } = donorDetails;

    if (!name || !email || !phone) {
      alert('Please fill all the required fields');
      return;
    }

    if (amount < 1) {
      alert('Please select a valid amount');
      return;
    }

    setIsLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay script failed to load');
      }

      // Create order - Updated to match backend route
      const orderResponse = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/donation/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          donorName: name,
          donorEmail: email,
          donorPhone: phone
        })
      });

      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'Donation Platform',
        description: 'Help make a difference',
        image: '/logo.png', // Add your logo here
        prefill: {
          name: name,
          email: email,
          contact: phone
        },
        theme: {
          color: '#E15519'
        },
        handler: async (response) => {
          try {
            // Verify payment - Updated to match backend route
            const verifyResponse = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/donation/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              setPaymentStatus('success');
              setShowForm(false);
              // Reset form
              setDonorDetails({ name: '', email: '', phone: '' });
              setSelectedAmount(null);
              setCustomAmount('');
            } else {
              setPaymentStatus('failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setPaymentStatus('failed');
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-[#FFFBF7] min-h-screen relative z-10 w-full font-['Outfit']">
      
      {/* Banner */}
      <section className="relative w-full h-[500px] md:h-[700px]">
        <img
          src="Donate_banner.jpg"
          alt="Donate Banner"
          className="w-full h-full object-cover"
          style={{ objectPosition: 'center 65%' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0.55) 100%)"
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-center items-start pl-8 md:pl-20">
          <span className="inline-flex items-center px-4 py-2 bg-black/30 text-white rounded-full text-sm font-medium backdrop-blur-sm border border-white/10">
            <Heart className="w-4 h-4 mr-2 text-[#E15519] fill-[#E15519]" />
            Support That Drives Hope
          </span>
          <h1 
            className="font-extrabold text-5xl md:text-7xl mb-4 drop-shadow-lg text-left text-[#FF5500] mt-4"
          >
            Donate Now
          </h1>
          <p className="text-white text-xl md:text-3xl font-semibold drop-shadow text-left">Help make a difference and share the love.</p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="w-full bg-[#FFE3C6] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollAnimate animation="fade-up">
            <h2 className="text-2xl md:text-3xl text-center font-bold mb-10 text-[#E15519]">Together we can make a difference</h2>
          </ScrollAnimate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <ScrollAnimate animation="fade-right">
              <div className="flex justify-center">
                <img src={donateIntro} alt="Charity Work" className="rounded-[32px] shadow-xl w-full max-w-[370px] aspect-[4/5] object-cover border-4 border-white/40" />
              </div>
            </ScrollAnimate>
            <ScrollAnimate animation="fade-left" delay={200}>
              <div className="flex flex-col items-center md:items-start">
                <h3 className="text-xl md:text-2xl font-bold mb-6 text-[#000000]">Be the reason of someone's smile</h3>
                
                {/* Amount Selection */}
                <div className="grid grid-cols-3 gap-4 mb-4 w-full max-w-[340px]">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`rounded-full font-bold py-2.5 px-4 text-lg shadow-sm focus:outline-none transition-all duration-300 ${
                        selectedAmount === amount
                          ? 'bg-[#E15519] text-white scale-105 shadow-md'
                          : 'bg-[#FF9E45] hover:bg-[#E15519] text-white'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="w-full max-w-[340px] mb-4">
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter custom amount"
                    className="w-full px-5 py-3 border border-orange-200 bg-[#FFF8F2] text-gray-800 rounded-xl placeholder-orange-400/70 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all font-medium"
                  />
                </div>

                {/* Donate Button */}
                <button
                  onClick={handleDonateClick}
                  disabled={getCurrentAmount() === 0}
                  className="mt-2 mb-4 w-full max-w-[340px] py-3.5 rounded-full font-bold text-white text-lg shadow-md transition-all duration-300 bg-[#FFA05E] hover:bg-[#E15519] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5 text-white fill-current" />
                  Donate ₹{getCurrentAmount()}
                </button>

                {/* Trust Indicators */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-gray-500" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>Trusted by 1000+</span>
                  </div>
                </div>
                
                <a href="#donation-impact" className="underline text-gray-800 hover:text-[#E15519] font-semibold text-base transition-colors" style={{scrollBehavior: 'smooth'}}>
                  Want to know where your donation goes?
                </a>
              </div>
            </ScrollAnimate>
          </div>
        </div>
      </section>

      {/* Enhanced Photo Gallery Section */}
      <section className="py-24 bg-[#FFFBF7] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollAnimate animation="fade-up">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-white border border-orange-200/60 rounded-full px-5 py-2 mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#E15519]"></span>
                <span className="text-xs uppercase tracking-widest text-[#E15519] font-bold">Gallery</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
                Memories That
                <span className="block text-[#FF5500] mt-1">
                  Matter
                </span>
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Capturing the joy and impact our volunteers create through shared moments of kindness and community
              </p>
            </div>
          </ScrollAnimate>

          {/* Enhanced Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {/* Large featured photo */}
            <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[32px] shadow-lg hover:shadow-xl transition-all duration-500 group">
              <img
                src={volunteerPhotos[0]}
                alt="Featured volunteer moment"
                className="w-full h-full min-h-[220px] md:min-h-[400px] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>

            {/* Medium photos */}
            {volunteerPhotos.slice(1, 5).map((photo, index) => (
              <div key={index} className="relative overflow-hidden rounded-[32px] shadow-md hover:shadow-lg transition-all duration-500 group">
                <img
                  src={photo}
                  alt={`Volunteer moment ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
            ))}

            {/* Small photos */}
            {volunteerPhotos.slice(5, 13).map((photo, index) => (
              <div key={index} className="relative overflow-hidden rounded-[24px] shadow-sm hover:shadow-md transition-all duration-500 group">
                <img
                  src={photo}
                  alt={`Volunteer moment ${index + 4}`}
                  className="w-full h-36 md:h-52 object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-[#E15519] mb-6 text-center">Donor Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  autoFocus
                  value={donorDetails.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={donorDetails.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={donorDetails.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all"
                  placeholder="Enter your phone number"
                />
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-700">Amount:</span>
                  <span className="text-2xl font-bold text-[#E15519]">₹{getCurrentAmount()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-[#FF7A00] to-[#FF9E45] text-white py-3 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Pay Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {paymentStatus && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4" onClick={() => setPaymentStatus(null)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            {paymentStatus === 'success' ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-6">Thank you for your generous donation. Your contribution will help make a real difference.</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h3>
                <p className="text-gray-600 mb-6">Something went wrong with your payment. Please try again.</p>
              </>
            )}
            <button
              onClick={() => setPaymentStatus(null)}
              className="bg-gradient-to-r from-[#FF7A00] to-[#FF9E45] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donate;
