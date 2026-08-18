import React, { useState, useEffect, useRef } from 'react';
import { Heart, Users, Globe, ArrowRight, ArrowLeft, MessageCircle, Award, Shield, PawPrint } from 'lucide-react';
import { useNavigate } from "react-router-dom";
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

// Image Imports
import home2 from "../assets/home2.jpg";
import feedingDrive from "../assets/feedingDrive.jpg";
import waterPot from "../assets/waterPot.jpg";
import radiumBelt from "../assets/radiumBelt.jpg";
import vaccination from "../assets/vaccination.jpg";
import adoption from "../assets/adoption.jpg";
import communityEvent from "../assets/communityEvent.jpg";
import goodDoggy from "/home1.png";
import donateIntro from "/home2.png";

// Volunteer Photos
import volunteer1 from "/New photo/IMG-20250603-WA0046~2.jpg";
import volunteer2 from "/New photo/IMG-20241206-WA0109~2.jpg";
import volunteer3 from "/New photo/IMG-20250603-WA0050~2.jpg";
import volunteer4 from "/New photo/IMG-20250604-WA0012~2.jpg";
import volunteer5 from "/New photo/IMG-20250604-WA0024~2.jpg";
import volunteer6 from "/New photo/IMG-20250604-WA0090.jpg";
import volunteer7 from "/New photo/IMG-20250604-WA0091.jpg";
import volunteer8 from "/New photo/IMG-20250604-WA0101.jpg";
import volunteer9 from "/New photo/IMG-20250604-WA0111(1).jpg";
import volunteer10 from "/New photo/IMG-20250604-WA0124~2.jpg";
import volunteer11 from "/New photo/IMG-20250604-WA0125~2.jpg";
import volunteer12 from "/New photo/IMG-20250604-WA0140.jpg";
import volunteer13 from "/New photo/IMG-20250604-WA0142.jpg";
import volunteer14 from "/New photo/IMG-20250604-WA0148.jpg";

function Home() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile viewport
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Reset carousel position when switching between mobile/desktop
    useEffect(() => {
        setCurrentSlide(0);
    }, [isMobile]);

    const initiatives = [
        {
            image: feedingDrive,
            title: "Daily feeding drives",
            description: "NSD nourish the lives of over 150+ street dogs with love, care, and hope. It's not just a routine; it's a mission to make their world brighter and kinder."
        },
        {
            image: waterPot,
            title: "Free water pots distribution",
            description: "Every summer, NSD distributes free water pots to ensure no street dog suffers from thirst or dehydration. It's our mission to keep them safe and hydrated, making sure no paws is left behind."
        },
        {
            image: radiumBelt,
            title: "Radium belts drive",
            description: "NSD is transforming street safety by outfitting dogs with reflective radium belts, reducing accidents by 30% in Nagpur. We're brightening the night to protect every street dog and ensure they're seen and safe."
        },
        {
            image: vaccination,
            title: "Rescue and vaccination",
            description: "NSD is committed to rescuing all animals in need - whether it's dogs, cows, cats, birds, or any other creatures. We believe every life matters and work tirelessly to offer help and hope to every animal, no matter the species."
        },
        {
            image: adoption,
            title: "Adoption camp",
            description: "From the streets to safe homes - our adoption camps connect abandoned and stray dogs with loving families."
        },
        {
            image: communityEvent,
            title: "Community events",
            description: "We organize events to bring together the pet community, fostering unity and creating a strong, supportive network for all pet lovers. Our goal is to build a community where everyone can connect, share, and grow together."
        }
    ];

    const volunteerPhotos = [
        volunteer1,
        volunteer2,
        volunteer3,
        volunteer4,
        volunteer5,
        volunteer6,
        volunteer7,
        volunteer8,
        volunteer9,
        volunteer10,
        volunteer11,
        volunteer12,
        volunteer13,
        volunteer14,
    ];

    // --- Initiatives Carousel ---
    const itemsPerSlide = isMobile ? 1 : 3;
    const maxSlide = isMobile 
        ? initiatives.length - 1 
        : Math.max(0, initiatives.length - itemsPerSlide);

    // Auto-slide for initiatives
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => {
                if (prev >= maxSlide) return 0;
                return prev + 1;
            });
        }, 5000);
        return () => clearInterval(timer);
    }, [maxSlide]);

    const nextSlide = () => {
        setCurrentSlide((prev) => {
            if (prev >= maxSlide) return 0;
            return prev + 1;
        });
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => {
            if (prev === 0) return maxSlide;
            return prev - 1;
        });
    };

    // Touch swipe support for mobile carousel
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
    const handleTouchMove = (e) => { touchEndX.current = e.touches[0].clientX; };
    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF8EF] text-[#17251E] font-dm-sans selection:bg-[#C1592A]/20">
            
            {/* 1. Hero Section */}
            <section className="pt-4 pb-16 md:pt-6 md:pb-24 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* Left Hero Column */}
                    <div className="lg:col-span-6 flex flex-col items-start text-left">
                        <ScrollAnimate animation="fade-right">
                            <span className="text-[#C1592A] text-xs font-bold uppercase tracking-widest block mb-4">
                                • SUPPORT THAT DRIVES HOPE
                            </span>
                            <h1 className="text-5xl md:text-7xl font-manrope font-extrabold text-[#17251E] mb-6 leading-[1.1] tracking-tight">
                                Every little help<br/>counts<span className="text-[#C1592A]">.</span>
                            </h1>
                            <p className="text-base md:text-lg text-[#3A362E]/90 mb-10 leading-relaxed font-dm-sans max-w-xl">
                                Together we can create a better future for street animals - one rescue, one meal, one home at a time.
                            </p>
                            <div className="flex flex-row items-center">
                                <button 
                                    onClick={() => navigate('/donate')} 
                                    className="bg-[#C1592A] hover:bg-[#D97706] text-[#FFF8EF] px-8 py-3.5 rounded-full font-dm-sans font-bold text-sm tracking-wide transition duration-300 shadow-md hover:-translate-y-0.5"
                                >
                                    Donate Now
                                </button>
                                <button 
                                    onClick={() => {
                                        const el = document.getElementById('about');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }} 
                                    className="text-[#17251E] hover:text-[#C1592A] font-dm-sans font-bold text-sm tracking-wide transition ml-8 underline underline-offset-8 decoration-2"
                                >
                                    Learn More
                                </button>
                            </div>
                        </ScrollAnimate>
                    </div>

                    {/* Right Hero Collage Column */}
                    <div className="lg:col-span-6 relative flex justify-center lg:justify-end pr-4">
                        <ScrollAnimate animation="fade-left" delay={200}>
                            <div className="relative w-full max-w-[480px]">
                                {/* Main Image */}
                                <img
                                    src={feedingDrive}
                                    alt="Feeding drive moment"
                                    className="w-full aspect-[4/3] md:aspect-square object-cover rounded-[3rem] shadow-xl border-4 border-[#FFF8EF]"
                                />
                                
                                {/* Bottom Left Overlapping Circle */}
                                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-[#FFF8EF] shadow-lg overflow-hidden absolute -bottom-6 -left-6 transform hover:scale-105 transition duration-300">
                                    <img 
                                        src={home2} 
                                        alt="Happy street dog" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Bottom Right Overlapping Circle */}
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#FFF8EF] shadow-lg overflow-hidden absolute -bottom-4 -right-4 transform hover:scale-105 transition duration-300">
                                    <img 
                                        src={volunteerPhotos[2]} 
                                        alt="Volunteers helping a dog" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </ScrollAnimate>
                    </div>

                </div>
            </section>

            {/* 2. Impact Statistics Banner */}
            <section className="px-6 lg:px-8 max-w-7xl mx-auto my-8">
                <ScrollAnimate animation="fade-up">
                    <div className="bg-[#17251E] text-[#FFF8EF] p-8 md:p-12 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-lg">
                        <div className="md:col-span-4 text-left">
                            <h3 className="text-2xl md:text-3xl font-manrope font-extrabold leading-tight">
                                What we've done together,<br className="hidden md:inline"/> so far.
                            </h3>
                        </div>
                        <div className="md:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <div className="text-3xl md:text-4xl font-manrope font-extrabold text-[#C1592A] mb-1">
                                    <StatNumber end={950} suffix="+" />
                                </div>
                                <div className="text-xs md:text-sm font-dm-sans opacity-70 uppercase tracking-widest">Dogs Rescued</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-manrope font-extrabold text-[#C1592A] mb-1">
                                    <StatNumber end={500} suffix="+" />
                                </div>
                                <div className="text-xs md:text-sm font-dm-sans opacity-70 uppercase tracking-widest">Adoptions</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-manrope font-extrabold text-[#C1592A] mb-1">
                                    <StatNumber end={3000} suffix="+" />
                                </div>
                                <div className="text-xs md:text-sm font-dm-sans opacity-70 uppercase tracking-widest">Animals Supported</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-manrope font-extrabold text-[#C1592A] mb-1">
                                    <StatNumber end={4} suffix="K+" />
                                </div>
                                <div className="text-xs md:text-sm font-dm-sans opacity-70 uppercase tracking-widest">Community Reached</div>
                            </div>
                        </div>
                    </div>
                </ScrollAnimate>
            </section>

            {/* 3. Who We Are Section */}
            <section id="about" className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* Left Column Image */}
                    <div className="lg:col-span-6">
                        <ScrollAnimate animation="fade-right">
                            <img
                                src={waterPot}
                                alt="Dog drinking water from NSD pot"
                                className="w-full aspect-[4/3] object-cover rounded-[2.5rem] shadow-md border border-[#E4DAC4]"
                            />
                        </ScrollAnimate>
                    </div>

                    {/* Right Column Text */}
                    <div className="lg:col-span-6 flex flex-col items-start text-left">
                        <ScrollAnimate animation="fade-left" delay={200}>
                            <span className="text-[#C1592A] text-xs font-bold uppercase tracking-widest block mb-4">
                                • WHO WE ARE
                            </span>
                            <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-[#17251E] mb-6 leading-tight">
                                Every street dog deserves a chance.
                            </h2>
                            <p className="text-base md:text-lg text-[#3A362E]/90 mb-8 leading-relaxed font-dm-sans">
                                Nagpur Street Dogs is a community-driven initiative rescuing, treating and rehoming stray dogs across the city. We work alongside volunteers, vets and local residents to build a safer, more compassionate Nagpur for every dog on its streets.
                            </p>
                            <button 
                                onClick={() => navigate('/about')}
                                className="text-[#C1592A] hover:text-[#D97706] font-dm-sans font-bold text-sm tracking-wide transition underline underline-offset-8 decoration-2"
                            >
                                Learn More
                            </button>
                        </ScrollAnimate>
                    </div>

                </div>
            </section>

            {/* 4. What We Do Section */}
            <section className="py-16 md:py-24 bg-[#FFF8EF]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <ScrollAnimate animation="fade-up">
                        <div className="text-center mb-16">
                            <span className="text-[#C1592A] text-xs font-bold uppercase tracking-widest block mb-4">• WHAT WE DO</span>
                            <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-[#17251E] leading-tight">
                                Direct, hands-on care for<br/>every dog we meet.
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
                                        alt="Rescue and Emergency Care" 
                                        className="w-full h-full object-cover transition duration-750 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center p-6 text-center">
                                        <div className="absolute top-6 left-6 bg-[#C1592A] text-[#FFF8EF] w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm font-dm-sans">01</div>
                                        <span className="text-base md:text-lg font-manrope font-extrabold text-[#FFF8EF] uppercase tracking-wider">rescue & emergency care</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mt-6 mb-2">Rescue & Emergency Care</h3>
                                <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">Rapid response to injured and at-risk dogs across the city.</p>
                            </div>
                        </ScrollAnimate>
 
                        {/* Card 2 */}
                        <ScrollAnimate animation="fade-up" delay={100}>
                            <div className="flex flex-col text-left group cursor-pointer">
                                <div className="overflow-hidden rounded-[2rem] aspect-[4/3] relative border border-[#E4DAC4] shadow-sm">
                                    <img 
                                        src={adoption} 
                                        alt="Medical Support" 
                                        className="w-full h-full object-cover transition duration-750 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center p-6 text-center">
                                        <div className="absolute top-6 left-6 bg-[#C1592A] text-[#FFF8EF] w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm font-dm-sans">02</div>
                                        <span className="text-base md:text-lg font-manrope font-extrabold text-[#FFF8EF] uppercase tracking-wider">medical support</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mt-6 mb-2">Medical Support</h3>
                                <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">Ongoing treatment, surgery and recovery with professional veterinary care.</p>
                            </div>
                        </ScrollAnimate>
 
                        {/* Card 3 */}
                        <ScrollAnimate animation="fade-up" delay={200}>
                            <div className="flex flex-col text-left group cursor-pointer">
                                <div className="overflow-hidden rounded-[2rem] aspect-[4/3] relative border border-[#E4DAC4] shadow-sm">
                                    <img 
                                        src={radiumBelt} 
                                        alt="Sterilization" 
                                        className="w-full h-full object-cover transition duration-750 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center p-6 text-center">
                                        <div className="absolute top-6 left-6 bg-[#C1592A] text-[#FFF8EF] w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm font-dm-sans">03</div>
                                        <span className="text-base md:text-lg font-manrope font-extrabold text-[#FFF8EF] uppercase tracking-wider">sterilization</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mt-6 mb-2">Sterilization</h3>
                                <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">Humane population control to reduce suffering and improve long-term welfare.</p>
                            </div>
                        </ScrollAnimate>
 
                        {/* Card 4 */}
                        <ScrollAnimate animation="fade-up" delay={300}>
                            <div className="flex flex-col text-left group cursor-pointer">
                                <div className="overflow-hidden rounded-[2rem] aspect-[4/3] relative border border-[#E4DAC4] shadow-sm">
                                    <img 
                                        src={communityEvent} 
                                        alt="Community & Awareness" 
                                        className="w-full h-full object-cover transition duration-750 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center p-6 text-center">
                                        <div className="absolute top-6 left-6 bg-[#C1592A] text-[#FFF8EF] w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm font-dm-sans">04</div>
                                        <span className="text-base md:text-lg font-manrope font-extrabold text-[#FFF8EF] uppercase tracking-wider">community & awareness</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mt-6 mb-2">Community & Awareness</h3>
                                <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">Rabies awareness, feeding drives and resident engagement across Nagpur.</p>
                            </div>
                        </ScrollAnimate>
 
                    </div>
                </div>
            </section>

            {/* 5. Parent Foundation Banner Row */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 border-t border-[#E4DAC4] mt-12 py-12">
                <ScrollAnimate animation="fade-up">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-[#17251E] text-[#FFF8EF] flex items-center justify-center font-manrope font-extrabold text-lg">U</div>
                            <span className="font-manrope font-extrabold text-lg text-[#17251E]">Uplift Relief Foundation</span>
                        </div>
                        <div className="max-w-2xl text-left">
                            <span className="text-[#C1592A] text-[10px] font-bold uppercase tracking-widest block mb-1">A PART OF SOMETHING BIGGER</span>
                            <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">
                                Nagpur Street Dogs is an initiative of Uplift Relief Foundation, working towards a more compassionate society through animal welfare, community engagement and meaningful action.
                            </p>
                        </div>
                        <div>
                            <a href="https://upliftrelieffoundation.org" target="_blank" rel="noopener noreferrer" className="text-[#17251E] hover:text-[#C1592A] font-dm-sans font-bold text-sm tracking-wide transition underline underline-offset-8 decoration-2 flex-shrink-0">
                                Learn More
                            </a>
                        </div>
                    </div>
                </ScrollAnimate>
            </section>

            {/* 6. Community Section */}
            <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8 border-t border-[#E4DAC4]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* Left side text */}
                    <div className="lg:col-span-6 flex flex-col items-start text-left">
                        <ScrollAnimate animation="fade-right">
                            <span className="text-[#C1592A] text-xs font-bold uppercase tracking-widest block mb-4">
                                • COMMUNITY
                            </span>
                            <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-[#17251E] mb-6 leading-tight">
                                Be part of our community.
                            </h2>
                            <p className="text-base md:text-lg text-[#3A362E]/90 mb-10 leading-relaxed font-dm-sans">
                                Real change happens when a community comes together. Join us in creating a safer, kinder city for every street dog.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button 
                                    onClick={() => navigate('/volunteer')} 
                                    className="bg-[#C1592A] hover:bg-[#D97706] text-[#FFF8EF] px-6 py-3 rounded-full font-dm-sans font-bold text-sm tracking-wide transition shadow-sm"
                                >
                                    Join as a Volunteer
                                </button>
                                <a 
                                    href="https://whatsapp.com/channel/0029VatlZaQ2P59rLcuPt90o" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="border-2 border-[#17251E] hover:bg-[#17251E]/5 text-[#17251E] px-6 py-3 rounded-full font-dm-sans font-bold text-sm tracking-wide transition text-center"
                                >
                                    Join Our Community
                                </a>
                                <button 
                                    onClick={() => navigate('/donate')} 
                                    className="border-2 border-[#17251E] hover:bg-[#17251E]/5 text-[#17251E] px-6 py-3 rounded-full font-dm-sans font-bold text-sm tracking-wide transition text-center"
                                >
                                    Support Our Work
                                </button>
                            </div>
                        </ScrollAnimate>
                    </div>

                    {/* Right side Image / Card */}
                    <div className="lg:col-span-6">
                        <ScrollAnimate animation="fade-left" delay={200}>
                            <img
                                src={communityEvent}
                                alt="NSD community event"
                                className="w-full aspect-[4/3] object-cover rounded-[2.5rem] shadow-md border border-[#E4DAC4]"
                            />
                        </ScrollAnimate>
                    </div>

                </div>
            </section>

            {/* 7. Life at NSD (Gallery Section) */}
            <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8 border-t border-[#E4DAC4]">
                <ScrollAnimate animation="fade-up">
                    <div className="text-left mb-12">
                        <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-[#17251E] mb-2 tracking-tight">Life at NSD.</h2>
                        <p className="text-base text-[#3A362E]/80 font-dm-sans">
                            A glimpse into the rescues, recoveries, and moments that make the work worth it.
                        </p>
                    </div>
                </ScrollAnimate>

                {/* Custom Grid matching Figma Wireframe */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    
                    {/* Grid item 1 (rescue moment) - spans 2 columns & 2 rows */}
                    <div className="md:col-span-2 md:row-span-2 overflow-hidden rounded-3xl border border-[#E4DAC4] shadow-sm relative group aspect-[4/3] md:aspect-square">
                        <img 
                            src={volunteerPhotos[0]} 
                            alt="Rescue moment" 
                            className="w-full h-full object-cover transition duration-500 group-hover:scale-102"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                            <span className="text-white font-manrope font-bold text-lg uppercase tracking-wide">Rescue Moment</span>
                        </div>
                    </div>

                    {/* Grid item 2 (rescued dog) */}
                    <div className="overflow-hidden rounded-2xl border border-[#E4DAC4] shadow-sm relative group aspect-[4/3] md:aspect-auto md:h-52">
                        <img 
                            src={volunteerPhotos[1]} 
                            alt="Rescued dog" 
                            className="w-full h-full object-cover transition duration-500 group-hover:scale-102"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                            <span className="text-white font-manrope font-bold text-sm uppercase tracking-wide">Rescued Dog</span>
                        </div>
                    </div>

                    {/* Grid item 3 (medical care) */}
                    <div className="overflow-hidden rounded-2xl border border-[#E4DAC4] shadow-sm relative group aspect-[4/3] md:aspect-auto md:h-52">
                        <img 
                            src={volunteerPhotos[2]} 
                            alt="Medical care" 
                            className="w-full h-full object-cover transition duration-500 group-hover:scale-102"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                            <span className="text-white font-manrope font-bold text-sm uppercase tracking-wide">Medical Care</span>
                        </div>
                    </div>

                    {/* Grid item 4 (volunteers) */}
                    <div className="overflow-hidden rounded-2xl border border-[#E4DAC4] shadow-sm relative group aspect-[4/3] md:aspect-auto md:h-52">
                        <img 
                            src={volunteerPhotos[3]} 
                            alt="Volunteers" 
                            className="w-full h-full object-cover transition duration-500 group-hover:scale-102"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                            <span className="text-white font-manrope font-bold text-sm uppercase tracking-wide">Volunteers</span>
                        </div>
                    </div>

                    {/* Grid item 5 (feeding drive) */}
                    <div className="overflow-hidden rounded-2xl border border-[#E4DAC4] shadow-sm relative group aspect-[4/3] md:aspect-auto md:h-52">
                        <img 
                            src={volunteerPhotos[4]} 
                            alt="Feeding drive" 
                            className="w-full h-full object-cover transition duration-500 group-hover:scale-102"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                            <span className="text-white font-manrope font-bold text-sm uppercase tracking-wide">Feeding Drive</span>
                        </div>
                    </div>

                    {/* Grid item 6 (adoption moment) - spans 2 columns */}
                    <div className="md:col-span-2 overflow-hidden rounded-2xl border border-[#E4DAC4] shadow-sm relative group aspect-[2/1] md:aspect-auto md:h-52">
                        <img 
                            src={volunteerPhotos[5]} 
                            alt="Adoption moment" 
                            className="w-full h-full object-cover transition duration-500 group-hover:scale-102"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                            <span className="text-white font-manrope font-bold text-sm uppercase tracking-wide">Adoption Moment</span>
                        </div>
                    </div>

                    {/* Grid item 7 (community activity) */}
                    <div className="overflow-hidden rounded-2xl border border-[#E4DAC4] shadow-sm relative group aspect-[4/3] md:aspect-auto md:h-52">
                        <img 
                            src={volunteerPhotos[6]} 
                            alt="Community activity" 
                            className="w-full h-full object-cover transition duration-500 group-hover:scale-102"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                            <span className="text-white font-manrope font-bold text-sm uppercase tracking-wide">Community Activity</span>
                        </div>
                    </div>

                </div>
            </section>

            {/* 8. Get Involved (Three Ways to Help) */}
            <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8 border-t border-[#E4DAC4]">
                <ScrollAnimate animation="fade-up">
                    <div className="text-left mb-16">
                        <span className="text-[#C1592A] text-xs font-bold uppercase tracking-widest block mb-4">• GET INVOLVED</span>
                        <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-[#17251E] tracking-tight">
                            Three ways to help right now.
                        </h2>
                    </div>
                </ScrollAnimate>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Card 1 */}
                    <ScrollAnimate animation="fade-up" delay={0}>
                        <div className="bg-[#FFFDF6] p-8 rounded-3xl border border-[#E4DAC4] text-left shadow-sm flex flex-col items-start h-full">
                            <div className="w-4 h-4 rounded-full bg-[#C1592A]" />
                            <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mb-2 mt-6">Donate</h3>
                            <p className="text-sm text-[#3A362E]/85 font-dm-sans leading-relaxed">Support rescue, food and medical care.</p>
                            <button onClick={() => navigate('/donate')} className="text-[#C1592A] hover:text-[#D97706] font-bold text-xs mt-6 uppercase tracking-wider font-dm-sans transition-colors cursor-pointer">
                                Learn More &rarr;
                            </button>
                        </div>
                    </ScrollAnimate>

                    {/* Card 2 */}
                    <ScrollAnimate animation="fade-up" delay={100}>
                        <div className="bg-[#FFFDF6] p-8 rounded-3xl border border-[#E4DAC4] text-left shadow-sm flex flex-col items-start h-full">
                            <div className="w-4 h-4 rounded-full bg-[#1B3B2E]" />
                            <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mb-2 mt-6">Volunteer</h3>
                            <p className="text-sm text-[#3A362E]/85 font-dm-sans leading-relaxed">Give your time, skills and energy.</p>
                            <button onClick={() => navigate('/volunteer')} className="text-[#17251E] hover:text-[#C1592A] font-bold text-xs mt-6 uppercase tracking-wider font-dm-sans transition-colors cursor-pointer">
                                Learn More &rarr;
                            </button>
                        </div>
                    </ScrollAnimate>

                    {/* Card 3 */}
                    <ScrollAnimate animation="fade-up" delay={200}>
                        <div className="bg-[#FFFDF6] p-8 rounded-3xl border border-[#E4DAC4] text-left shadow-sm flex flex-col items-start h-full">
                            <div className="w-4 h-4 rounded-full bg-[#C1592A]" />
                            <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mb-2 mt-6">Adopt</h3>
                            <p className="text-sm text-[#3A362E]/85 font-dm-sans leading-relaxed">Provide temporary care and a safe home.</p>
                            <button onClick={() => navigate('/adopt')} className="text-[#C1592A] hover:text-[#D97706] font-bold text-xs mt-6 uppercase tracking-wider font-dm-sans transition-colors cursor-pointer">
                                Learn More &rarr;
                            </button>
                        </div>
                    </ScrollAnimate>

                </div>
            </section>

            {/* 9. Your Support Can Save a Life Banner */}
            <section className="px-6 lg:px-8 max-w-7xl mx-auto my-8">
                <ScrollAnimate animation="fade-up">
                    <div className="bg-[#17251E] text-[#FFF8EF] p-8 md:p-16 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-lg relative overflow-hidden">
                        
                        {/* Text and CTA */}
                        <div className="md:col-span-7 text-left flex flex-col items-start">
                            <h3 className="text-3xl md:text-5xl font-manrope font-extrabold leading-tight mb-4">
                                Your support can save a life.
                            </h3>
                            <p className="text-base text-white/80 font-dm-sans mb-8 max-w-md">
                                Every contribution helps us rescue, treat and care for street dogs.
                            </p>
                            <button 
                                onClick={() => navigate('/donate')}
                                className="bg-[#C1592A] hover:bg-[#D97706] text-[#FFF8EF] px-8 py-3.5 rounded-full font-dm-sans font-bold text-sm tracking-wide transition duration-300 shadow-md hover:-translate-y-0.5"
                            >
                                Donate Now
                            </button>
                        </div>

                        {/* Image Box */}
                        <div className="md:col-span-5 flex justify-center md:justify-end">
                            <img
                                src={donateIntro}
                                alt="Happy rescued dog"
                                className="w-full max-w-[340px] aspect-[4/3] object-cover rounded-3xl border border-[#E4DAC4]"
                            />
                        </div>

                    </div>
                </ScrollAnimate>
            </section>

            {/* 10. Let's Stay in Touch Section (Contact Form) */}
            <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8 border-t border-[#E4DAC4] my-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    
                    {/* Left Column info */}
                    <div className="lg:col-span-5 text-left flex flex-col items-start">
                        <ScrollAnimate animation="fade-right">
                            <span className="text-[#C1592A] text-xs font-bold uppercase tracking-widest block mb-4">• GET IN TOUCH</span>
                            <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-[#17251E] mb-6 leading-tight">
                                Let's stay in touch.
                            </h2>
                            <p className="text-base md:text-lg text-[#3A362E]/90 mb-8 leading-relaxed font-dm-sans">
                                For rescue support, volunteering, adoption or general enquiries, we'd love to hear from you.
                            </p>
                            <div className="space-y-2 font-dm-sans text-sm text-[#3A362E] mb-8">
                                <p>Nagpur, Maharashtra, India</p>
                                <p className="font-bold text-[#17251E]">hello@nagpurstreetdogs.org</p>
                            </div>
                            <div className="flex gap-4 font-dm-sans text-sm text-[#17251E] font-bold">
                                <a href="https://www.instagram.com/nagpur_street_dogs?igsh=MXdubWFuN2F6Z3ppeA==" target="_blank" rel="noopener noreferrer" className="hover:text-[#C1592A] transition">Instagram</a>
                                <a href="https://whatsapp.com/channel/0029VatlZaQ2P59rLcuPt90o" target="_blank" rel="noopener noreferrer" className="hover:text-[#C1592A] transition">Facebook</a>
                            </div>
                        </ScrollAnimate>
                    </div>

                    {/* Right Column Form */}
                    <div className="lg:col-span-7 w-full">
                        <ScrollAnimate animation="fade-left" delay={200}>
                            <form className="bg-[#FFF8EF] p-8 md:p-10 rounded-[2rem] border border-[#E4DAC4] shadow-sm flex flex-col space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col text-left">
                                        <label className="text-xs font-bold text-[#17251E] uppercase tracking-wide mb-2 font-dm-sans">Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="Your Name" 
                                            className="w-full bg-[#FFFDF9]/60 border border-[#E4DAC4] rounded-xl px-4 py-3 font-dm-sans text-sm text-[#17251E] placeholder:text-[#3A362E]/40 focus:outline-none focus:border-[#C1592A] transition-colors"
                                        />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <label className="text-xs font-bold text-[#17251E] uppercase tracking-wide mb-2 font-dm-sans">Email</label>
                                        <input 
                                            type="email" 
                                            placeholder="Your Email Address" 
                                            className="w-full bg-[#FFFDF9]/60 border border-[#E4DAC4] rounded-xl px-4 py-3 font-dm-sans text-sm text-[#17251E] placeholder:text-[#3A362E]/40 focus:outline-none focus:border-[#C1592A] transition-colors"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col text-left">
                                    <label className="text-xs font-bold text-[#17251E] uppercase tracking-wide mb-2 font-dm-sans">Message</label>
                                    <textarea 
                                        rows="4" 
                                        placeholder="How can we help?" 
                                        className="w-full bg-[#FFFDF9]/60 border border-[#E4DAC4] rounded-xl px-4 py-3 font-dm-sans text-sm text-[#17251E] placeholder:text-[#3A362E]/40 focus:outline-none focus:border-[#C1592A] transition-colors resize-none"
                                    />
                                </div>
                                <div className="text-left">
                                    <button 
                                        type="submit" 
                                        onClick={(e) => e.preventDefault()}
                                        className="bg-[#C1592A] hover:bg-[#D97706] text-[#FFF8EF] px-8 py-3 rounded-full font-dm-sans font-bold text-sm tracking-wide transition shadow-sm w-full md:w-auto"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        </ScrollAnimate>
                    </div>

                </div>
            </section>

        </div>
    );
}

export default Home;