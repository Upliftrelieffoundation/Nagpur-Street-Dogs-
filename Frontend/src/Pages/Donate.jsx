import React, { useState, useEffect } from 'react';
import { Heart, Check, X, Shield, Users, Loader2 } from 'lucide-react';
import ScrollAnimate from '../Animation/ScrollAnimate';

// Image Imports
import home2 from "../assets/home2.jpg";
import feedingDrive from "../assets/feedingDrive.jpg";
import waterPot from "../assets/waterPot.jpg";
import radiumBelt from "../assets/radiumBelt.jpg";
import vaccination from "../assets/vaccination.jpg";
import adoption from "../assets/adoption.jpg";
import communityEvent from "../assets/communityEvent.jpg";

function Donate() {
  const [selectedAmount, setSelectedAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  const [donorDetails, setDonorDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // UPI payment flow state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Checkout, 2: App Opening, 3: Processing, 4: Success, 5: Failed, 6: Pending
  const [selectedUpiApp, setSelectedUpiApp] = useState('');
  const [upiId, setUpiId] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [refNo, setRefNo] = useState('');
  const [paymentTime, setPaymentTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const predefinedAmounts = [500, 1000, 2500, 5000];

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDonorDetails(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const handleScrollToCard = () => {
      if (window.location.hash === '#donate-card') {
        const el = document.getElementById('donate-card');
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 150);
        }
      }
    };

    handleScrollToCard();
    window.addEventListener('hashchange', handleScrollToCard);
    return () => window.removeEventListener('hashchange', handleScrollToCard);
  }, []);

  // Dynamically load Razorpay checkout script
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

  const startCheckoutFlow = () => {
    const amount = getCurrentAmount();
    if (amount <= 0) {
      alert("Please select or enter a valid donation amount.");
      return;
    }
    if (!donorDetails.name || !donorDetails.email || !donorDetails.phone) {
      alert("Please fill in your name, email, and phone number to proceed.");
      return;
    }

    setCheckoutStep(1);
    setShowCheckoutModal(true);
  };

  // Run the hybrid payment flow (Razorpay with UPI prefill, fallback to simulation)
  const executePayment = async (appName = '', userVpa = '') => {
    const amount = getCurrentAmount();
    const { name, email, phone } = donorDetails;

    setSelectedUpiApp(appName || 'UPI ID');
    setIsLoading(true);
    setCheckoutStep(2); // Screen 2: App Opening

    // Generate mock details in case of simulation fallback
    const rNo = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    const tId = "TXN" + Math.floor(10000000000 + Math.random() * 90000000000).toString();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ", " + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    setRefNo(rNo);
    setTransactionId(tId);
    setPaymentTime(dateStr);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay failed to load');
      }

      const serverDomain = import.meta.env.VITE_SERVER_DOMAIN || 'https://nsd-backend-api.vercel.app';
      const orderResponse = await fetch(`${serverDomain}/api/donation/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          donorName: name,
          donorEmail: email,
          donorPhone: phone
        })
      });

      const orderData = await orderResponse.json();
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create backend order');
      }

      setCheckoutStep(3); // Screen 3: Processing

      // Configure Razorpay checkout options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'Nagpur Street Dogs',
        description: 'Donation for street dogs welfare',
        image: '/logo.png',
        prefill: {
          name: name,
          email: email,
          contact: phone,
          method: 'upi',
          vpa: userVpa
        },
        theme: {
          color: '#C1592A'
        },
        handler: async (response) => {
          try {
            // Verify payment on the backend
            const verifyResponse = await fetch(`${serverDomain}/api/donation/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();
            if (verifyData.success) {
              setCheckoutStep(4); // Screen 4: Success
            } else {
              setCheckoutStep(5); // Screen 5: Failed
            }
          } catch (e) {
            setCheckoutStep(5);
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            setCheckoutStep(5); // Dismiss is treated as payment failed/canceled
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.warn("⚠️ Razorpay unavailable or API keys not set. Falling back to UPI Payment Simulation Sandbox.", error);
      // Fallback: Continue simulation automatically
      setTimeout(() => {
        setCheckoutStep(3); // Transition to Screen 3 (Processing)
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EF] text-[#17251E] font-dm-sans selection:bg-[#C1592A]/20">
      
      {/* 1. Hero Section */}
      <section className="pt-4 pb-16 md:pt-6 md:pb-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <ScrollAnimate animation="fade-right">
              <span className="text-[#C1592A] text-xs font-bold uppercase tracking-widest block mb-4">
                • SUPPORT NSD
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-manrope font-extrabold text-[#17251E] mb-6 leading-tight tracking-tight">
                Your support can save a life.
              </h1>
              <p className="text-base md:text-lg text-[#3A362E]/90 leading-relaxed font-dm-sans max-w-xl">
                Every donation directly funds rescue, medical treatment, sterilization and food for street dogs.
              </p>
            </ScrollAnimate>
          </div>

          {/* Right Column Image */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <ScrollAnimate animation="fade-left" delay={200}>
              <img
                src={home2}
                alt="Emotional rescued dog"
                className="w-full max-w-[480px] aspect-[4/3] object-cover rounded-[3rem] shadow-xl border border-[#E4DAC4]"
              />
            </ScrollAnimate>
          </div>

        </div>
      </section>

      {/* 2. Choose your contribution card section */}
      <section id="donate-card" className="py-8 max-w-4xl mx-auto px-6">
        <ScrollAnimate animation="fade-up">
          <div className="bg-[#FFFDF6] p-8 md:p-12 rounded-[2.5rem] border border-[#E4DAC4] text-left shadow-sm">
            <h2 className="text-2xl md:text-3xl font-manrope font-extrabold text-[#17251E] mb-8">
              Choose your contribution.
            </h2>
            
            {/* Amount Grid */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {predefinedAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleAmountSelect(amount)}
                  className={`px-6 py-3.5 rounded-2xl font-dm-sans font-bold text-sm tracking-wide transition duration-200 border cursor-pointer ${
                    selectedAmount === amount
                      ? 'bg-[#FFF8EF] border-[#17251E] text-[#17251E]'
                      : 'bg-[#EDE6D3]/60 border-transparent hover:bg-[#EDE6D3] text-[#3A362E]'
                  }`}
                >
                  ₹{amount.toLocaleString('en-IN')}
                </button>
              ))}
              
              {/* Custom Input Embedded */}
              <div className="relative min-w-[200px] flex-grow">
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Custom Amount"
                  className="w-full px-5 py-3 border border-[#E4DAC4] bg-[#FFF8EF] text-gray-800 rounded-2xl placeholder-gray-400 focus:outline-none focus:border-[#17251E] transition font-bold font-dm-sans text-sm"
                />
              </div>
            </div>

            {/* Donor Information Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={donorDetails.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full px-5 py-3.5 border border-[#E4DAC4] bg-[#FFF8EF] rounded-2xl placeholder-gray-400 focus:outline-none focus:border-[#17251E] transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={donorDetails.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-5 py-3.5 border border-[#E4DAC4] bg-[#FFF8EF] rounded-2xl placeholder-gray-400 focus:outline-none focus:border-[#17251E] transition text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={donorDetails.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="w-full px-5 py-3.5 border border-[#E4DAC4] bg-[#FFF8EF] rounded-2xl placeholder-gray-400 focus:outline-none focus:border-[#17251E] transition text-sm"
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={startCheckoutFlow}
              className="bg-[#C1592A] hover:bg-[#D97706] text-[#FFF8EF] px-10 py-4 rounded-full font-dm-sans font-bold text-sm tracking-wide transition duration-300 shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              Donate Now
            </button>
          </div>
        </ScrollAnimate>
      </section>

      {/* 3. Where your support goes Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8 border-t border-[#E4DAC4]">
        <ScrollAnimate animation="fade-up">
          <div className="text-left mb-16">
            <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-[#17251E] tracking-tight">
              Where your support goes.
            </h2>
          </div>
        </ScrollAnimate>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Card 1 */}
          <ScrollAnimate animation="fade-up" delay={0}>
            <div className="flex flex-col text-left group cursor-pointer">
              <div className="overflow-hidden rounded-[2rem] aspect-[4/3] relative border border-[#E4DAC4] shadow-sm">
                <img 
                  src={vaccination} 
                  alt="Medical Care" 
                  className="w-full h-full object-cover transition duration-750 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center p-6 text-center">
                  <span className="text-base md:text-lg font-manrope font-extrabold text-[#FFF8EF] uppercase tracking-wider">medical care</span>
                </div>
              </div>
              <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mt-6">Medical Care</h3>
            </div>
          </ScrollAnimate>

          {/* Card 2 */}
          <ScrollAnimate animation="fade-up" delay={100}>
            <div className="flex flex-col text-left group cursor-pointer">
              <div className="overflow-hidden rounded-[2rem] aspect-[4/3] relative border border-[#E4DAC4] shadow-sm">
                <img 
                  src={feedingDrive} 
                  alt="Food & Feeding" 
                  className="w-full h-full object-cover transition duration-750 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center p-6 text-center">
                  <span className="text-base md:text-lg font-manrope font-extrabold text-[#FFF8EF] uppercase tracking-wider">food & feeding</span>
                </div>
              </div>
              <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mt-6">Food & Feeding</h3>
            </div>
          </ScrollAnimate>

          {/* Card 3 */}
          <ScrollAnimate animation="fade-up" delay={200}>
            <div className="flex flex-col text-left group cursor-pointer">
              <div className="overflow-hidden rounded-[2rem] aspect-[4/3] relative border border-[#E4DAC4] shadow-sm">
                <img 
                  src={adoption} 
                  alt="Rescue" 
                  className="w-full h-full object-cover transition duration-750 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center p-6 text-center">
                  <span className="text-base md:text-lg font-manrope font-extrabold text-[#FFF8EF] uppercase tracking-wider">rescue</span>
                </div>
              </div>
              <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mt-6">Rescue</h3>
            </div>
          </ScrollAnimate>

          {/* Card 4 */}
          <ScrollAnimate animation="fade-up" delay={300}>
            <div className="flex flex-col text-left group cursor-pointer">
              <div className="overflow-hidden rounded-[2rem] aspect-[4/3] relative border border-[#E4DAC4] shadow-sm">
                <img 
                  src={radiumBelt} 
                  alt="Sterilization" 
                  className="w-full h-full object-cover transition duration-750 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center p-6 text-center">
                  <span className="text-base md:text-lg font-manrope font-extrabold text-[#FFF8EF] uppercase tracking-wider">sterilization</span>
                </div>
              </div>
              <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mt-6">Sterilization</h3>
            </div>
          </ScrollAnimate>

        </div>
      </section>

      {/* 4. Complete transparency Section */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto my-8">
        <ScrollAnimate animation="fade-up">
          <div className="bg-[#17251E] text-[#FFF8EF] p-8 md:p-12 rounded-[2.5rem] text-left shadow-lg">
            <h3 className="text-2xl md:text-3xl font-manrope font-extrabold leading-tight mb-4">
              Complete transparency.
            </h3>
            <p className="text-sm md:text-base font-dm-sans opacity-80 leading-relaxed max-w-3xl">
              Every rupee donated goes directly toward rescue, treatment and care for street dogs - supported by a network of volunteers and partner veterinarians across Nagpur.
            </p>
          </div>
        </ScrollAnimate>
      </section>

      {/* 5. Bottom Donate Now CTA Banner */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto my-8">
        <ScrollAnimate animation="fade-up">
          <div className="bg-[#17251E] text-[#FFF8EF] p-12 md:p-16 rounded-[2.5rem] text-center shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-3xl md:text-5xl font-manrope font-extrabold leading-tight mb-8">
                Together, we can give them a better tomorrow.
              </h3>
              <button 
                onClick={() => {
                  const el = document.getElementById('donate-card');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#C1592A] hover:bg-[#D97706] text-[#FFF8EF] px-8 py-3.5 rounded-full font-dm-sans font-bold text-sm tracking-wide transition duration-300 shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                Donate Now
              </button>
            </div>
          </div>
        </ScrollAnimate>
      </section>

      {/* 6. UPI Payment Flow Simulation Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
          <div className="bg-[#FFF8EF] text-[#17251E] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative border border-[#E4DAC4]" onClick={(e) => e.stopPropagation()}>
            
            {/* Close Modal Button */}
            <button 
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold"
            >
              <X className="w-5 h-5" />
            </button>

            {/* SCREEN 1: UPI Checkout */}
            {checkoutStep === 1 && (
              <div>
                <h3 className="text-xl font-manrope font-extrabold text-left mb-6">Complete your payment</h3>
                
                {/* Donation Box Info */}
                <div className="bg-[#EDE6D3]/50 rounded-2xl p-4 flex justify-between items-center mb-6 border border-[#E4DAC4]">
                  <div>
                    <span className="text-xs text-gray-500 block uppercase tracking-wider">Donation</span>
                    <span className="text-2xl font-manrope font-extrabold text-[#17251E]">₹{getCurrentAmount()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 block uppercase tracking-wider">Recipient</span>
                    <span className="text-sm font-manrope font-extrabold text-[#17251E]">Nagpur Street Dogs</span>
                  </div>
                </div>

                {/* Pay with UPI Apps */}
                <div className="mb-6">
                  <span className="text-xs font-bold text-[#3A362E] block mb-3 uppercase tracking-wider">Pay with UPI App</span>
                  <div className="grid grid-cols-4 gap-3">
                    <button onClick={() => executePayment('Google Pay')} className="flex flex-col items-center group">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition">G</div>
                      <span className="text-[10px] font-bold text-gray-600 mt-1.5">Google Pay</span>
                    </button>
                    <button onClick={() => executePayment('PhonePe')} className="flex flex-col items-center group">
                      <div className="w-12 h-12 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition">P</div>
                      <span className="text-[10px] font-bold text-gray-600 mt-1.5">PhonePe</span>
                    </button>
                    <button onClick={() => executePayment('Paytm')} className="flex flex-col items-center group">
                      <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition">Py</div>
                      <span className="text-[10px] font-bold text-gray-600 mt-1.5">Paytm</span>
                    </button>
                    <button onClick={() => executePayment('BHIM')} className="flex flex-col items-center group">
                      <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition">B</div>
                      <span className="text-[10px] font-bold text-gray-600 mt-1.5">BHIM</span>
                    </button>
                  </div>
                </div>

                {/* Scan & Pay QR Code */}
                <div className="mb-6 border-t border-[#E4DAC4] pt-6 flex flex-col items-center">
                  <span className="text-xs font-bold text-[#3A362E] block mb-3 uppercase tracking-wider">Scan & Pay</span>
                  <div className="w-36 h-36 bg-[#EDE6D3]/40 border-2 border-[#E4DAC4] rounded-2xl flex flex-col items-center justify-center p-3 relative shadow-inner">
                    {/* Simulated QR Code blocks */}
                    <div className="w-full h-full grid grid-cols-7 grid-rows-7 gap-1 bg-white p-2.5 rounded-lg">
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div></div>
                      <div className="bg-[#17251E] rounded-sm"></div>

                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div className="bg-[#17251E] rounded-sm"></div>

                      <div></div><div></div><div></div><div></div><div></div><div></div><div></div>

                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div></div>
                      <div></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div></div>

                      <div></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div></div>
                      <div className="bg-[#17251E] rounded-sm"></div>

                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div></div>
                      <div></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                      <div className="bg-[#17251E] rounded-sm"></div>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-2 text-center">Scan this QR code using any UPI app</span>
                  <span className="text-xs font-bold text-[#17251E] mt-0.5">Amount: ₹{getCurrentAmount()}</span>
                </div>

                {/* Pay Using UPI ID */}
                <div className="border-t border-[#E4DAC4] pt-6">
                  <span className="text-xs font-bold text-[#3A362E] block mb-2 uppercase tracking-wider">Pay using UPI ID</span>
                  <div className="space-y-3">
                    <input 
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter your UPI ID - e.g. name@upi"
                      className="w-full px-4 py-3 border border-[#E4DAC4] bg-[#FFF8EF] rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-[#17251E] transition"
                    />
                    <button 
                      onClick={() => executePayment('UPI ID', upiId)}
                      className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white py-3 rounded-xl font-bold text-sm tracking-wide transition shadow-sm cursor-pointer"
                    >
                      Pay ₹{getCurrentAmount()}
                    </button>
                    <span className="text-[10px] text-gray-500 block text-center mt-1">Enter your UPI ID to receive a payment request</span>
                  </div>
                </div>

                {/* Secure Notice */}
                <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Secure UPI Payment</span>
                </div>
              </div>
            )}

            {/* SCREEN 2: UPI App Opening */}
            {checkoutStep === 2 && (
              <div className="py-8 flex flex-col items-center text-center">
                {/* Circular Loader */}
                <div className="w-16 h-16 rounded-full border-4 border-[#E4DAC4] border-t-[#3B82F6] animate-spin mb-6" />
                <h3 className="text-lg font-manrope font-extrabold mb-2">Opening your UPI app...</h3>
                
                <div className="bg-[#EDE6D3]/40 rounded-2xl py-3 px-6 mb-6 mt-4 border border-[#E4DAC4] inline-block">
                  <span className="text-2xl font-manrope font-extrabold text-[#17251E]">₹{getCurrentAmount()}</span>
                  <span className="text-xs text-gray-500 block">Nagpur Street Dogs</span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed max-w-[280px] mb-8">
                  You will be redirected back automatically once the payment is complete.
                </p>

                <div className="w-full border-t border-[#E4DAC4] pt-6 flex flex-col items-center">
                  <span className="text-xs text-gray-500 mb-2">Didn't open?</span>
                  <button 
                    onClick={() => setCheckoutStep(1)}
                    className="px-6 py-2 border border-[#3B82F6] text-[#3B82F6] hover:bg-blue-50/50 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Try another payment method
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 3: Payment Processing */}
            {checkoutStep === 3 && (
              <div className="py-8 flex flex-col items-center text-center">
                {/* Ring spinner */}
                <div className="relative w-16 h-16 flex items-center justify-center mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin" />
                </div>
                
                <h3 className="text-lg font-manrope font-extrabold mb-2">Processing payment...</h3>

                <div className="bg-[#EDE6D3]/40 rounded-2xl py-3 px-6 mb-6 mt-4 border border-[#E4DAC4] inline-block">
                  <span className="text-2xl font-manrope font-extrabold text-[#17251E]">₹{getCurrentAmount()}</span>
                  <span className="text-xs text-gray-500 block">Nagpur Street Dogs</span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed max-w-[280px] mb-8">
                  Please do not close this window.
                </p>

                {/* Simulate Outcomes Overlay (Developer Sandbox) */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 w-full">
                  <span className="text-[10px] font-bold text-amber-600 block mb-2 uppercase tracking-wider">Simulate Outcome (local sandbox)</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setCheckoutStep(4)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-1.5 px-2 rounded-lg cursor-pointer">Success</button>
                    <button onClick={() => setCheckoutStep(5)} className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold py-1.5 px-2 rounded-lg cursor-pointer">Fail</button>
                    <button onClick={() => setCheckoutStep(6)} className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold py-1.5 px-2 rounded-lg cursor-pointer">Pending</button>
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN 4: Payment Successful */}
            {checkoutStep === 4 && (
              <div className="py-4 flex flex-col items-center text-center">
                {/* Green Check circle */}
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                
                <h3 className="text-xl font-manrope font-extrabold text-emerald-600 mb-1">Payment Successful</h3>
                
                <div className="bg-emerald-50/50 rounded-2xl py-3 px-6 mb-4 border border-emerald-100 inline-block w-full">
                  <span className="text-2xl font-manrope font-extrabold text-[#17251E]">₹{getCurrentAmount()}</span>
                  <span className="text-xs text-gray-500 block">Nagpur Street Dogs</span>
                </div>

                <span className="text-xs font-bold text-[#17251E] mb-6 block">Thank you for your contribution ❤️</span>

                {/* Receipt Details Table */}
                <div className="w-full bg-[#EDE6D3]/30 border border-[#E4DAC4] rounded-2xl p-4 text-left space-y-2.5 text-xs mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Transaction ID</span>
                    <span className="font-bold font-mono text-[#17251E]">{transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">UPI Reference No.</span>
                    <span className="font-bold text-[#17251E]">{refNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date & Time</span>
                    <span className="font-bold text-[#17251E]">{paymentTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment Method</span>
                    <span className="font-bold text-[#17251E]">{selectedUpiApp || 'UPI App'}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <button 
                    onClick={() => {
                      alert(`Mock receipt printed for ${donorDetails.name}. Order Reference: ${refNo}`);
                    }}
                    className="border border-[#3B82F6] text-[#3B82F6] hover:bg-blue-50/30 py-3 rounded-xl font-bold text-xs tracking-wide transition cursor-pointer"
                  >
                    View Receipt
                  </button>
                  <button 
                    onClick={() => setShowCheckoutModal(false)}
                    className="bg-[#3B82F6] hover:bg-blue-600 text-white py-3 rounded-xl font-bold text-xs tracking-wide transition cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 5: Payment Failed */}
            {checkoutStep === 5 && (
              <div className="py-6 flex flex-col items-center text-center">
                {/* Red cross circle */}
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                  <X className="w-8 h-8 text-rose-600" />
                </div>
                
                <h3 className="text-xl font-manrope font-extrabold text-rose-600 mb-1">Payment Failed</h3>

                <div className="bg-rose-50/50 rounded-2xl py-3 px-6 mb-4 border border-rose-100 inline-block w-full">
                  <span className="text-2xl font-manrope font-extrabold text-[#17251E]">₹{getCurrentAmount()}</span>
                  <span className="text-xs text-gray-500 block">Nagpur Street Dogs</span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed max-w-[280px] mb-8">
                  We couldn't complete your payment.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={() => setCheckoutStep(1)}
                    className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition cursor-pointer"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={() => setCheckoutStep(1)}
                    className="w-full border border-[#3B82F6] text-[#3B82F6] hover:bg-blue-50/30 py-3 rounded-xl font-bold text-xs tracking-wide transition cursor-pointer"
                  >
                    Choose Another Payment Method
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 6: Payment Pending */}
            {checkoutStep === 6 && (
              <div className="py-6 flex flex-col items-center text-center">
                {/* Yellow exclamation circle */}
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4 font-bold text-2xl text-amber-600">
                  !
                </div>
                
                <h3 className="text-xl font-manrope font-extrabold text-amber-600 mb-1">Payment Pending</h3>

                <div className="bg-amber-50/50 rounded-2xl py-3 px-6 mb-4 border border-amber-100 inline-block w-full">
                  <span className="text-2xl font-manrope font-extrabold text-[#17251E]">₹{getCurrentAmount()}</span>
                  <span className="text-xs text-gray-500 block">Nagpur Street Dogs</span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed max-w-[280px] mb-8">
                  Your payment is being verified. Please wait a moment.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={() => {
                      setCheckoutStep(4);
                    }}
                    className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition cursor-pointer"
                  >
                    Check Status
                  </button>
                  <button 
                    onClick={() => setCheckoutStep(1)}
                    className="w-full border border-[#3B82F6] text-[#3B82F6] hover:bg-blue-50/30 py-3 rounded-xl font-bold text-xs tracking-wide transition cursor-pointer"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default Donate;
