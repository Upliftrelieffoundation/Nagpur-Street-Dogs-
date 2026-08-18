import React, { useState, useEffect, useRef } from 'react';
import { Heart, Users, Shield, Check, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ScrollAnimate from '../Animation/ScrollAnimate';

// Animated counter hook
const useCountUp = (end, duration = 2000, startOnView = true) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHasStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [hasStarted, end, duration]);

  return [count, ref];
};

const StatNumber = ({ end, suffix = "" }) => {
  const [count, ref] = useCountUp(end);
  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
};

// Volunteer Photos
const volunteerPhotos = [
  "/New photo/IMG-20250604-WA0090.jpg",
  "/New photo/IMG-20250604-WA0133.jpg",
  "/New photo/IMG-20250603-WA0050~2.jpg",
  "/New photo/IMG-20250604-WA0079.jpg",
  "/New photo/IMG-20250604-WA0148.jpg",
  "/New photo/IMG-20250604-WA0093.jpg",
  "/New photo/IMG-20250604-WA0140.jpg",
  "/New photo/IMG-20250604-WA0088.jpg",
  "/New photo/IMG-20250604-WA0101.jpg",
  "/New photo/IMG-20241206-WA0109~2.jpg",
  "/New photo/IMG-20250316-WA0019.jpg",
  "/New photo/IMG-20250604-WA0139.jpg",
  "/New photo/IMG-20250604-WA0097.jpg"
];

const interestOptions = [
  "Rescue & Emergency Care",
  "Feeding & Animal Care",
  "Adoption Support",
  "Events & Awareness",
  "Social Media & Content",
  "Fundraising & Outreach",
  "Photography / Videography",
  "Other"
];

const availabilityOptions = [
  "Weekdays",
  "Weekends",
  "Both",
  "Flexible"
];

function VolunteerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    skills: '',
    whyJoin: ''
  });
  
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState('Flexible');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter your full name');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    if (!formData.phone.trim() || !/^[0-9]{10,15}$/.test(formData.phone)) {
      alert('Please enter a valid phone number');
      return;
    }

    setIsSubmitting(true);

    try {
      // Build layout payload that satisfies backend constraints while retaining user inputs
      const addressDetails = [
        `Interests: ${selectedInterests.join(', ')}`,
        `Availability: ${selectedAvailability}`,
        formData.skills ? `Skills: ${formData.skills}` : '',
        formData.whyJoin ? `Why: ${formData.whyJoin}` : ''
      ].filter(Boolean).join(' | ');

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        city: formData.city.trim() || 'Nagpur',
        address: addressDetails.substring(0, 250), // Fallback address stores custom volunteer info
        state: 'Maharashtra',
        country: 'India',
        pincode: '440001'
      };

      const serverDomain = import.meta.env.VITE_SERVER_DOMAIN || 'https://nsd-backend-api.vercel.app';
      const response = await fetch(`${serverDomain}/api/volunteer/createVolunteer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      toast.success('Registration successful! Thank you for volunteering.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        skills: '',
        whyJoin: ''
      });
      setSelectedInterests([]);
      setSelectedAvailability('Flexible');

    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
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
                • VOLUNTEER
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-manrope font-extrabold text-[#17251E] mb-6 leading-tight tracking-tight">
                Be the voice for the voiceless.
              </h1>
              <p className="text-base md:text-lg text-[#3A362E]/90 mb-8 leading-relaxed font-dm-sans max-w-xl">
                Your time, skills and compassion can make a real difference in the lives of street animals across Nagpur.
              </p>
              <div className="flex flex-row items-center">
                <button 
                  onClick={() => {
                    const el = document.getElementById('join-form');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#C1592A] hover:bg-[#D97706] text-[#FFF8EF] px-8 py-3.5 rounded-full font-dm-sans font-bold text-sm tracking-wide transition duration-300 shadow-md hover:-translate-y-0.5 cursor-pointer"
                >
                  Become a Volunteer
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('what-can-do');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[#17251E] hover:text-[#C1592A] font-dm-sans font-bold text-sm tracking-wide transition ml-8 underline underline-offset-8 decoration-2 cursor-pointer"
                >
                  Learn More
                </button>
              </div>
            </ScrollAnimate>
          </div>

          {/* Right Column Image */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <ScrollAnimate animation="fade-left" delay={200}>
              <img
                src={volunteerPhotos[1]}
                alt="Volunteers with rescued dogs"
                className="w-full max-w-[480px] aspect-[4/3] object-cover rounded-[3rem] shadow-xl border border-[#E4DAC4]"
              />
            </ScrollAnimate>
          </div>

        </div>
      </section>

      {/* 2. Why volunteer with us Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8 border-t border-[#E4DAC4]">
        <ScrollAnimate animation="fade-up">
          <div className="text-left mb-16">
            <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-[#17251E] tracking-tight">
              Why volunteer with us.
            </h2>
          </div>
        </ScrollAnimate>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Card 1 */}
          <ScrollAnimate animation="fade-up" delay={0}>
            <div className="bg-[#FFFDF6] p-8 rounded-3xl border border-[#E4DAC4] text-left shadow-sm flex flex-col items-start h-full">
              <div className="w-4 h-4 rounded-full bg-[#C1592A]" />
              <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mb-2 mt-6">Make a Difference</h3>
              <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">Help rescue, feed, treat and protect animals who need us most.</p>
            </div>
          </ScrollAnimate>

          {/* Card 2 */}
          <ScrollAnimate animation="fade-up" delay={100}>
            <div className="bg-[#FFFDF6] p-8 rounded-3xl border border-[#E4DAC4] text-left shadow-sm flex flex-col items-start h-full">
              <div className="w-4 h-4 rounded-full bg-[#1B3B2E]" />
              <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mb-2 mt-6">Meet Like-Minded People</h3>
              <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">Join a growing community of people who care about animal welfare.</p>
            </div>
          </ScrollAnimate>

          {/* Card 3 */}
          <ScrollAnimate animation="fade-up" delay={200}>
            <div className="bg-[#FFFDF6] p-8 rounded-3xl border border-[#E4DAC4] text-left shadow-sm flex flex-col items-start h-full">
              <div className="w-4 h-4 rounded-full bg-[#C1592A]" />
              <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mb-2 mt-6">Learn & Grow</h3>
              <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">Gain real-world experience through rescue and community initiatives.</p>
            </div>
          </ScrollAnimate>

          {/* Card 4 */}
          <ScrollAnimate animation="fade-up" delay={300}>
            <div className="bg-[#FFFDF6] p-8 rounded-3xl border border-[#E4DAC4] text-left shadow-sm flex flex-col items-start h-full">
              <div className="w-4 h-4 rounded-full bg-[#1B3B2E]" />
              <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mb-2 mt-6">Be Part of Change</h3>
              <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">Help build a kinder and more compassionate Nagpur.</p>
            </div>
          </ScrollAnimate>

        </div>
      </section>

      {/* 3. What you can do Section */}
      <section id="what-can-do" className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8 border-t border-[#E4DAC4]">
        <ScrollAnimate animation="fade-up">
          <div className="text-left mb-16">
            <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-[#17251E] tracking-tight">
              What you can do.
            </h2>
          </div>
        </ScrollAnimate>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 border-t border-[#E4DAC4] pt-12">
          
          {/* Item 1 */}
          <div className="text-left">
            <span className="text-xs font-bold text-[#C1592A] uppercase tracking-widest block mb-2">01 Rescue Support</span>
            <p className="text-sm text-[#3A362E]/85 font-dm-sans leading-relaxed">Help with rescue operations and emergency situations.</p>
          </div>

          {/* Item 2 */}
          <div className="text-left">
            <span className="text-xs font-bold text-[#C1592A] uppercase tracking-widest block mb-2">02 Feeding & Care</span>
            <p className="text-sm text-[#3A362E]/85 font-dm-sans leading-relaxed">Support feeding drives and daily animal care.</p>
          </div>

          {/* Item 3 */}
          <div className="text-left">
            <span className="text-xs font-bold text-[#C1592A] uppercase tracking-widest block mb-2">03 Events & Awareness</span>
            <p className="text-sm text-[#3A362E]/85 font-dm-sans leading-relaxed">Participate in campaigns, community events and drives.</p>
          </div>

          {/* Item 4 */}
          <div className="text-left">
            <span className="text-xs font-bold text-[#C1592A] uppercase tracking-widest block mb-2">04 Social Media & Content</span>
            <p className="text-sm text-[#3A362E]/85 font-dm-sans leading-relaxed">Spread the mission through content and photography.</p>
          </div>

          {/* Item 5 */}
          <div className="text-left">
            <span className="text-xs font-bold text-[#C1592A] uppercase tracking-widest block mb-2">05 Fundraising & Outreach</span>
            <p className="text-sm text-[#3A362E]/85 font-dm-sans leading-relaxed">Connect the organization with supporters and communities.</p>
          </div>

          {/* Item 6 */}
          <div className="text-left">
            <span className="text-xs font-bold text-[#C1592A] uppercase tracking-widest block mb-2">06 Foster & Adoption Support</span>
            <p className="text-sm text-[#3A362E]/85 font-dm-sans leading-relaxed">Help rescued animals find temporary or permanent homes.</p>
          </div>

        </div>
      </section>

      {/* 4. More hands. More hope. More lives saved Statistics Box */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto my-8">
        <ScrollAnimate animation="fade-up">
          <div className="bg-[#17251E] text-[#FFF8EF] p-8 md:p-12 rounded-[2.5rem] shadow-lg flex flex-col justify-between">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8 border-b border-[#FFF8EF]/20 pb-8">
              <div className="lg:col-span-6 text-left">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-manrope font-extrabold leading-tight">
                  More hands. More hope.<br/>More lives saved.
                </h3>
                <p className="text-xs md:text-sm font-dm-sans opacity-70 mt-4 leading-relaxed max-w-md">
                  Every rescue, every meal and every adoption becomes possible when a community comes together.
                </p>
              </div>
              <div className="lg:col-span-6 flex justify-end">
                <img 
                  src={volunteerPhotos[2]} 
                  alt="Volunteer community" 
                  className="w-full max-w-[420px] h-48 md:h-56 object-cover rounded-[2rem] border border-[#FFF8EF]/10" 
                />
              </div>
            </div>

            {/* Impact stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              <div>
                <div className="text-2xl md:text-3xl font-manrope font-extrabold text-[#C1592A] mb-1">
                  <StatNumber end={950} suffix="+" />
                </div>
                <div className="text-[10px] md:text-xs font-dm-sans opacity-70 uppercase tracking-widest">Dogs Rescued</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-manrope font-extrabold text-[#C1592A] mb-1">
                  <StatNumber end={500} suffix="+" />
                </div>
                <div className="text-[10px] md:text-xs font-dm-sans opacity-70 uppercase tracking-widest">Adoptions</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-manrope font-extrabold text-[#C1592A] mb-1">
                  <StatNumber end={3000} suffix="+" />
                </div>
                <div className="text-[10px] md:text-xs font-dm-sans opacity-70 uppercase tracking-widest">Animals Supported</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-manrope font-extrabold text-[#C1592A] mb-1">
                  <StatNumber end={4} suffix="K+" />
                </div>
                <div className="text-[10px] md:text-xs font-dm-sans opacity-70 uppercase tracking-widest">Community Reached</div>
              </div>
            </div>
          </div>
        </ScrollAnimate>
      </section>

      {/* 5. Ready to Join Form Section */}
      <section id="join-form" className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8 border-t border-[#E4DAC4]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column Text */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <ScrollAnimate animation="fade-right">
              <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-[#17251E] mb-6 leading-tight">
                Ready to join<br/>the team?
              </h2>
              <p className="text-sm md:text-base text-[#3A362E]/90 mb-8 leading-relaxed font-dm-sans max-w-md">
                Tell us a little about yourself and how you'd like to help. Every volunteer makes a real difference.
              </p>
              <img 
                src={volunteerPhotos[0]} 
                alt="Volunteer collage impact visual" 
                className="w-full aspect-[4/3] object-cover rounded-[2.5rem] border border-[#E4DAC4]" 
              />
            </ScrollAnimate>
          </div>

          {/* Right Column Form Card */}
          <div className="lg:col-span-7">
            <ScrollAnimate animation="fade-left" delay={200}>
              <div className="bg-[#FFFDF6] p-8 md:p-10 rounded-[2.5rem] border border-[#E4DAC4] text-left shadow-sm">
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Inputs row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className="w-full px-5 py-3 border border-[#E4DAC4] bg-[#FFF8EF] rounded-2xl placeholder-gray-400 focus:outline-none focus:border-[#17251E] transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        className="w-full px-5 py-3 border border-[#E4DAC4] bg-[#FFF8EF] rounded-2xl placeholder-gray-400 focus:outline-none focus:border-[#17251E] transition text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                        className="w-full px-5 py-3 border border-[#E4DAC4] bg-[#FFF8EF] rounded-2xl placeholder-gray-400 focus:outline-none focus:border-[#17251E] transition text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-2">City / Area *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Virar, Nagpur"
                        className="w-full px-5 py-3 border border-[#E4DAC4] bg-[#FFF8EF] rounded-2xl placeholder-gray-400 focus:outline-none focus:border-[#17251E] transition text-sm"
                      />
                    </div>
                  </div>

                  {/* Interests Pill Tags */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-3">Volunteer Interests</label>
                    <div className="flex flex-wrap gap-2">
                      {interestOptions.map(option => {
                        const isSelected = selectedInterests.includes(option);
                        return (
                          <button
                            type="button"
                            key={option}
                            onClick={() => handleInterestToggle(option)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 border cursor-pointer ${
                              isSelected
                                ? 'bg-[#FFF8EF] border-[#17251E] text-[#17251E]'
                                : 'bg-[#EDE6D3]/30 border-transparent hover:bg-[#EDE6D3]/60 text-[#3A362E]'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Availability Pill Choice */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-3">Availability</label>
                    <div className="flex flex-wrap gap-2">
                      {availabilityOptions.map(option => (
                        <button
                          type="button"
                          key={option}
                          onClick={() => setSelectedAvailability(option)}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition duration-200 border cursor-pointer ${
                            selectedAvailability === option
                              ? 'bg-[#FFF8EF] border-[#17251E] text-[#17251E]'
                              : 'bg-[#EDE6D3]/30 border-transparent hover:bg-[#EDE6D3]/60 text-[#3A362E]'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Areas */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-2">Relevant skills / experience</label>
                    <textarea
                      name="skills"
                      rows={3}
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="Share any special skills or previous volunteering experience..."
                      className="w-full px-5 py-3.5 border border-[#E4DAC4] bg-[#FFF8EF] rounded-2xl placeholder-gray-400 focus:outline-none focus:border-[#17251E] transition text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-2">Why would you like to volunteer?</label>
                    <textarea
                      name="whyJoin"
                      rows={3}
                      value={formData.whyJoin}
                      onChange={handleInputChange}
                      placeholder="Tell us what motivates you to join us..."
                      className="w-full px-5 py-3.5 border border-[#E4DAC4] bg-[#FFF8EF] rounded-2xl placeholder-gray-400 focus:outline-none focus:border-[#17251E] transition text-sm"
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#C1592A] hover:bg-[#D97706] text-[#FFF8EF] py-4 rounded-full font-dm-sans font-bold text-sm tracking-wide transition duration-300 shadow-md hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Join the Community'
                    )}
                  </button>

                  <span className="text-[10px] text-gray-500 block text-center mt-2">Together, we can create a kinder city for every paw.</span>
                </form>

              </div>
            </ScrollAnimate>
          </div>

        </div>
      </section>

      {/* 6. Bottom Banner CTA */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto my-8">
        <ScrollAnimate animation="fade-up">
          <div className="bg-[#17251E] text-[#FFF8EF] p-12 md:p-16 rounded-[2.5rem] text-center shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-3xl md:text-5xl font-manrope font-extrabold leading-tight mb-8">
                Ready to make a difference?
              </h3>
              <p className="text-xs md:text-sm font-dm-sans opacity-70 mb-8 max-w-lg mx-auto">
                Join Nagpur Street Dogs and become part of a community working for a safer, kinder city for animals.
              </p>
              <button 
                onClick={() => {
                  const el = document.getElementById('join-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#C1592A] hover:bg-[#D97706] text-[#FFF8EF] px-8 py-3.5 rounded-full font-dm-sans font-bold text-sm tracking-wide transition duration-300 shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                Become a Volunteer
              </button>
            </div>
          </div>
        </ScrollAnimate>
      </section>

    </div>
  );
}

export default VolunteerPage;
