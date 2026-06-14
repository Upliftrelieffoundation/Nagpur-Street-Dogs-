import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, Users, Globe, Menu, X, ArrowRight, ArrowLeft, Phone, MessageCircle, Award, Shield, PawPrint } from 'lucide-react';
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

// Hero Imagessrc/assets/home2.jpg
import home2 from "../assets/home2.jpg";
import feedingDrive from "../assets/feedingDrive.jpg";

// Initiative Images
import waterPot from "../assets/waterPot.jpg";
import radiumBelt from "../assets/radiumBelt.jpg";
import vaccination from "../assets/vaccination.jpg";
import adoption from "../assets/adoption.jpg";
import communityEvent from "../assets/communityEvent.jpg";

import goodDoggy from "/home1.png";
import donateIntro from "/home2.png";


// Other Images
// import goodDoggy from "../../public/home1.png"; // Updated path to match the new structure
// import donateIntro from "../../public/home2.png"; // Updated path to match the new structure
// ../../public/New photo/New photo/IMG-20250603-WA0046~2.jpg
// Volunteer Photos C:\Users\RBU\Desktop\Wooferz1\Frontend\public\New photo\IMG-20240918-WA0039(1).jpg
// import volunteer1 from "../../public/New photo/IMG-20250603-WA0046~2.jpg"; // Updated path to match the new structure
// import volunteer2 from "../../public/New photo/IMG-20241206-WA0109~2.jpg";
// import volunteer3 from "../../public/New photo/IMG-20250603-WA0050~2.jpg";
// import volunteer4 from "../../public/New photo/IMG-20250604-WA0012~2.jpg";
// import volunteer5 from "../../public/New photo/IMG-20250604-WA0024~2.jpg";
// import volunteer6 from "../../public/New photo/IMG-20250604-WA0090.jpg";
// import volunteer7 from "../../public/New photo/IMG-20250604-WA0091.jpg";
// import volunteer8 from "../../public/New photo/IMG-20250604-WA0101.jpg";
// import volunteer9 from "../../public/New photo/IMG-20250604-WA0111(1).jpg";
// import volunteer10 from "../../public/New photo/IMG-20250604-WA0124~2.jpg";
// import volunteer11 from "../../public/New photo/IMG-20250604-WA0125~2.jpg";
// import volunteer12 from "../../public/New photo/IMG-20250604-WA0140.jpg";
// import volunteer13 from "../../public/New photo/IMG-20250604-WA0142.jpg";
// import volunteer14 from "../../public/New photo/IMG-20250604-WA0148.jpg";

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


// Animated stat card component
const StatCard = ({ icon, end, suffix, label }) => {
  const [count, ref] = useCountUp(end);
  return (
    <div ref={ref} className="bg-white p-6 md:p-8 rounded-3xl shadow-[0_15px_40px_-15px_rgba(249,115,22,0.08)] border border-orange-100/30 text-center transition-all duration-300 hover:shadow-[0_20px_50px_-10px_rgba(249,115,22,0.12)] hover:-translate-y-1">
      <div className="bg-[#FFF6EB] w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-[#F97316]">
        {icon}
      </div>
      <div className="text-3xl md:text-4xl font-extrabold text-[#F97316] mb-2 tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-gray-500 text-xs font-bold uppercase tracking-wider leading-relaxed">{label}</div>
    </div>
  );
};

function Home() {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
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

    const heroImages = [
        {
            image: feedingDrive,
            title: "Providing Medical Care",
            subtitle: "Professional veterinary treatment for every rescued animal"
        },
        {
            image: home2,
            title: "Every Little Help Counts",
            subtitle: "Together we can create a better future for street animals."
        }
    ];

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
            description: "NSD is committed to rescuing all animals in need—whether it's dogs, cows, cats, birds, or any other creatures. We believe every life matters and work tirelessly to offer help and hope to every animal, no matter the species."
        },
        {
            image: adoption,
            title: "Adoption camp",
            description: "From the streets to safe homes — our adoption camps connect abandoned and stray dogs with loving families."
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

    // Auto-slide for hero section
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentHeroSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Enhanced Hero Section with Image Swiping */}
            <section id="home" className="relative min-h-screen overflow-hidden">
                <div className="absolute inset-0">
                    {heroImages.map((hero, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${currentHeroSlide === index ? 'opacity-100' : 'opacity-0'
                                }`}
                            style={{
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${hero.image}')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            }}
                        />
                    ))}
                </div>

                {/* Hero Content */}
                <div className="relative z-10 flex items-center min-h-screen pt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="max-w-3xl">
                            <div className="mb-6">
                                <span className="inline-flex items-center px-4 py-1.5 bg-[#FFF6EB]/90 text-[#EA580C] border border-orange-200/50 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                    <Heart className="w-3.5 h-3.5 mr-1.5 fill-current text-orange-500" />
                                    Support That Drives Hope
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                                {heroImages[currentHeroSlide].title}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200/95 mb-10 leading-relaxed max-w-2xl font-normal">
                                {heroImages[currentHeroSlide].subtitle}
                            </p>
                            <div className="flex flex-row gap-4">
                                <button className="bg-[#F97316] hover:bg-orange-600 text-white px-8 py-3.5 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:-translate-y-0.5 cursor-pointer" onClick={() => navigate('/donate')}>
                                    DONATE NOW
                                </button>
                                <button className="border-2 border-white/80 hover:border-white text-white hover:bg-white/10 px-8 py-3.5 rounded-full text-sm font-bold tracking-wider uppercase transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer" onClick={() => navigate('/about')}>
                                    LEARN MORE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Navigation Dots */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="flex space-x-3">
                        {heroImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentHeroSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentHeroSlide === index
                                        ? 'bg-orange-500 w-8'
                                        : 'bg-white/50 hover:bg-white/70'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </section>
            {/* Enhanced Stats Section */}
            <section className="py-24 bg-[#FAF5EA] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <ScrollAnimate animation="fade-up">
                        <div className="text-center mb-16">
                            <span className="text-[#EA580C] text-sm font-extrabold uppercase tracking-widest block mb-3">Our Impact in Numbers</span>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">Making a difference, one life at a time</h2>
                        </div>
                    </ScrollAnimate>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
                        <ScrollAnimate animation="zoom-in" delay={0}><StatCard icon={<Heart className="w-6 h-6 text-[#F97316]" />} end={950} suffix="+" label="Rescue Cases" /></ScrollAnimate>
                        <ScrollAnimate animation="zoom-in" delay={100}><StatCard icon={<Award className="w-6 h-6 text-[#F97316]" />} end={500} suffix="+" label="Adoptions" /></ScrollAnimate>
                        <ScrollAnimate animation="zoom-in" delay={200}><StatCard icon={<Shield className="w-6 h-6 text-[#F97316]" />} end={3000} suffix="+" label="Radium Belts Distributed" /></ScrollAnimate>
                        <ScrollAnimate animation="zoom-in" delay={300}><StatCard icon={<Globe className="w-6 h-6 text-[#F97316]" />} end={5} suffix="k+" label="Community Members" /></ScrollAnimate>
                    </div>
                </div>
            </section>

            {/* Enhanced About Us Section */}
            <section id="about" className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <ScrollAnimate animation="fade-right">
                            <div className="relative p-4">
                                <img
                                    src={goodDoggy}
                                    alt="About us"
                                    className="rounded-[3rem] rounded-tl-[8rem] rounded-br-[8rem] w-full object-cover shadow-[0_25px_60px_-15px_rgba(249,115,22,0.15)] border-8 border-[#FAF5EA]"
                                />
                                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-100 rounded-full opacity-60 -z-10 animate-pulse"></div>
                                <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-200 rounded-full opacity-40 -z-10"></div>
                            </div>
                        </ScrollAnimate>
                        <ScrollAnimate animation="fade-left" delay={200}>
                            <div>
                                <div className="mb-6">
                                    <span className="text-[#EA580C] text-sm font-extrabold uppercase tracking-widest block mb-2">Our Story</span>
                                    <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mt-1 mb-6">About Us</h2>
                                </div>
                                <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                                    <p>
                                        Nagpur street dogs is a self funded youth community founded by a 16 year old boy in 2020.
                                        We focus on providing food , medical care, free water pots every summer, shelter and many more to the animals in need.
                                        Through our dedicated efforts, we aim to create a safer and kinder environment for street Animals.
                                    </p>
                                    <p>
                                        We focus on providing comprehensive care including food, water, medical treatment, and shelter. Our dedicated team works tirelessly to make every summer and winter more comfortable for street animals while advocating for better policies to create a stable, nurturing environment for all animals in need.
                                    </p>
                                    <div className="flex flex-row gap-6 md:gap-8 pt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#FFF6EB] flex items-center justify-center text-[#F97316]">
                                                <Heart className="w-5 h-5 fill-current" />
                                            </div>
                                            <span className="font-extrabold text-gray-800 tracking-wide text-sm md:text-base">Compassionate Care</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#FFF6EB] flex items-center justify-center text-[#F97316]">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <span className="font-extrabold text-gray-800 tracking-wide text-sm md:text-base">Community Driven</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollAnimate>
                    </div>
                </div>
            </section>

            {/* Enhanced Our Initiatives Section */}
            <section id="initiatives" className="py-24 bg-[#F8F9FA] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <ScrollAnimate animation="fade-up">
                        <div className="text-center mb-16">
                            <span className="text-[#EA580C] text-sm font-extrabold uppercase tracking-widest block mb-3">Our Initiatives</span>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Our Initiatives</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Comprehensive programs designed to rescue, rehabilitate, and rehome street animals
                            </p>
                        </div>
                    </ScrollAnimate>
 
                    <div className="relative max-w-6xl mx-auto px-4">
                        <div className="overflow-hidden rounded-3xl shadow-xl"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <div className="flex transition-transform duration-500 ease-in-out"
                                style={{ transform: `translateX(-${currentSlide * (isMobile ? 100 : 100 / 3)}%)` }}>
                                {initiatives.map((initiative, index) => (
                                    <div
                                        key={index}
                                        className={`flex-shrink-0 relative px-2.5 group cursor-pointer ${isMobile ? 'w-full' : 'w-1/3'}`}
                                        style={{ zIndex: 1 }}
                                    >
                                        <div className="overflow-hidden rounded-2xl relative shadow-md">
                                            <img
                                                src={initiative.image}
                                                alt={initiative.title}
                                                className="w-full h-80 md:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end items-start p-6 md:p-8 transition-all duration-500">
                                                <h3 className="text-lg md:text-2xl font-extrabold z-10 text-[#F97316] mb-2 uppercase tracking-wide drop-shadow-md">
                                                    {initiative.title}
                                                </h3>
                                                <p
                                                    className={`text-xs md:text-sm text-gray-200 z-10 overflow-hidden leading-relaxed transition-all duration-500 ${
                                                        isMobile
                                                            ? 'opacity-100 max-h-40'
                                                            : 'opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40'
                                                    }`}
                                                >
                                                    {initiative.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
 
                        {/* Navigation Arrows */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-2 md:-left-6 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white text-[#F97316] border border-orange-100/50 flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-orange-50 hover:scale-110 active:scale-95 z-20 cursor-pointer"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-2 md:-right-6 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-white text-[#F97316] border border-orange-100/50 flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-orange-50 hover:scale-110 active:scale-95 z-20 cursor-pointer"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
 
                        {/* Dots Indicator */}
                        <div className="flex justify-center mt-10 space-x-2">
                            {Array.from({ length: isMobile ? initiatives.length : Math.ceil(initiatives.length / 3) }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(isMobile ? index : index)}
                                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === index ? 'bg-[#F97316] w-6' : 'bg-gray-300 hover:bg-gray-400 w-2'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Parent Foundation Section */}
            <section className="py-20 bg-[#FFFDF6] border-y border-orange-100/50 relative overflow-hidden">
                {/* Floating Paw Prints to create the mockup pattern */}
                <PawPrint className="absolute left-8 top-8 w-24 h-24 text-orange-500/5 rotate-12 pointer-events-none" />
                <PawPrint className="absolute right-12 bottom-6 w-32 h-32 text-orange-500/5 -rotate-12 pointer-events-none" />
                <PawPrint className="absolute left-1/3 bottom-4 w-16 h-16 text-orange-500/5 rotate-45 pointer-events-none" />
                <PawPrint className="absolute right-1/4 top-6 w-20 h-20 text-orange-500/5 -rotate-45 pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <ScrollAnimate animation="fade-up">
                        <span 
                            onClick={() => window.open('https://upliftrelieffoundation.org', '_blank')}
                            className="text-[#EA580C] hover:text-orange-600 cursor-pointer text-xs font-extrabold uppercase tracking-widest block mb-3 transition-colors"
                        >
                            OUR PARENT FOUNDATION
                        </span>
                        <h2 
                            onClick={() => window.open('https://upliftrelieffoundation.org', '_blank')}
                            className="text-3xl md:text-5xl font-black text-gray-900 hover:text-orange-500 cursor-pointer mb-8 tracking-tight transition-colors"
                        >
                            UPLIFT RELIEF FOUNDATION
                        </h2>
                        <button 
                            onClick={() => window.open('https://upliftrelieffoundation.org', '_blank')} 
                            className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-orange-500/25 transform hover:-translate-y-0.5 cursor-pointer"
                        >
                            Learn more about it
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </ScrollAnimate>
                </div>
            </section>

            {/* Enhanced Donation Section */}
            <section id="donate" className="py-24 bg-gradient-to-br from-[#FFFDF9] via-[#FAF4E8] to-[#FFF9EE] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <ScrollAnimate animation="fade-right">
                        <div>
                            <div className="mb-8">
                                <span className="text-[#EA580C] text-sm font-extrabold uppercase tracking-widest block mb-2">Make a Difference</span>
                                <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-2 mb-4 tracking-tight leading-tight">
                                    Together we can save lives
                                </h2>
                                <p className="text-lg md:text-xl font-bold text-[#F97316]">
                                    Be The Reason Someone Smiles Today
                                </p>
                            </div>
 
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <button className="bg-[#F97316] hover:bg-orange-600 text-white py-4 rounded-2xl font-extrabold text-lg transition-all duration-300 shadow-md hover:shadow-orange-500/20 transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer" onClick={() => navigate('/donate')}>
                                    ₹150
                                </button>
                                <button className="bg-[#F97316] hover:bg-orange-600 text-white py-4 rounded-2xl font-extrabold text-lg transition-all duration-300 shadow-md hover:shadow-orange-500/20 transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer" onClick={() => navigate('/donate')}>
                                    ₹500
                                </button>
                                <button className="bg-[#F97316] hover:bg-orange-600 text-white py-4 rounded-2xl font-extrabold text-lg transition-all duration-300 shadow-md hover:shadow-orange-500/20 transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer" onClick={() => navigate('/donate')}>
                                    ₹1000
                                </button>
                                <button className="bg-[#F97316] hover:bg-orange-600 text-white py-4 rounded-2xl font-extrabold text-lg transition-all duration-300 shadow-md hover:shadow-orange-500/20 transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer" onClick={() => navigate('/donate')}>
                                    ₹5000
                                </button>
                            </div>
 
                            <div className="bg-[#FFF6EB] border border-orange-200/60 p-6 rounded-2xl shadow-sm">
                                <p className="text-[#EA580C] text-base md:text-lg font-extrabold mb-1.5 flex items-center gap-2">
                                    💝 "Want To Know Where Your Donation Goes? Just Ask!"
                                </p>
                                <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                                    Complete transparency on how your contribution helps save lives
                                </p>
                            </div>
                        </div>
                        </ScrollAnimate>
 
                        <ScrollAnimate animation="fade-left" delay={200}>
                        <div className="relative p-4">
                            <img
                                src={donateIntro}
                                alt="Happy rescued dog"
                                className="rounded-[2.5rem] shadow-2xl border-8 border-white w-full object-cover"
                            />
                            <div className="absolute -bottom-2 -right-2 w-32 h-32 bg-orange-100 rounded-full opacity-60 -z-10 animate-pulse"></div>
                            <div className="absolute -top-2 -left-2 w-24 h-24 bg-orange-200 rounded-full opacity-40 -z-10"></div>
                        </div>
                        </ScrollAnimate>
                    </div>
                </div>
            </section>

            {/* Enhanced WhatsApp Community Section */}
            <section className="py-20 bg-gradient-to-r from-orange-500 to-[#EA580C] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <ScrollAnimate animation="flip-up">
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">
                            Join Our Community
                        </h3>
                        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Connect with like-minded animal lovers, get updates on rescues, and be part of our mission to create a better world for street animals.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="https://whatsapp.com/channel/0029VatlZaQ2P59rLcuPt90o" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-green-500/20 transform hover:-translate-y-0.5 cursor-pointer">
                                <MessageCircle className="mr-2 w-5 h-5 fill-current" />
                                Join WhatsApp Community
                            </a>
                            <a href="https://www.instagram.com/nagpur_street_dogs?igsh=MXdubWFuN2F6Z3ppeA==" target="_blank" rel="noopener noreferrer" className="border-2 border-white/80 hover:border-white text-white hover:bg-white/10 px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider flex items-center justify-center transition-all duration-300 shadow-md transform hover:-translate-y-0.5 cursor-pointer">
                                Follow on Instagram
                            </a>
                        </div>
                    </div>
                    </ScrollAnimate>
                </div>
            </section>
            
            {/* Call to Action */}
            <div className="max-w-6xl mx-auto px-4 mt-20">
                <ScrollAnimate animation="zoom-in">
                    <div className="text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white py-16 px-8 md:p-16 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full"></div>
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full"></div>
                        <div className="relative z-10">
                            <h3 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Ready to Make a Difference?</h3>
                            <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
                                Join our mission to save lives and create happy endings for dogs in need.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button onClick={() => { navigate("/adopt") }} className="bg-white text-[#F97316] hover:bg-orange-50 px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 flex items-center gap-2 cursor-pointer">
                                    <Heart className="w-4 h-4 fill-current text-orange-500" />
                                    Adopt a Dog
                                </button>
                                <button onClick={() => { navigate("/volunteer") }} className="bg-[#FACC15] hover:bg-[#EAB308] text-gray-900 px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 flex items-center gap-2 cursor-pointer">
                                    <Users className="w-4 h-4" />
                                    Become a Volunteer
                                </button>
                                <button onClick={() => { navigate("/donate") }} className="border-2 border-white text-white hover:bg-white/10 px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 flex items-center gap-2 cursor-pointer">
                                    <PawPrint className="w-4 h-4" />
                                    Donate Now
                                </button>
                            </div>
                        </div>
                    </div>
                </ScrollAnimate>
            </div>

            {/* Gallery Section */}
            <section className="bg-white py-24 border-t border-orange-100/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollAnimate animation="fade-up">
                        <span className="text-[#EA580C] text-sm font-extrabold uppercase tracking-widest block text-center mb-3">Moments</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-12 text-center tracking-tight">Gallery</h2>
                    </ScrollAnimate>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 p-2 md:p-5">
                        {/* Large featured photo */}
                        <div className="col-span-2 row-span-2 relative group overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500">
                            <img
                                src={volunteerPhotos[0]}
                                alt="Featured volunteer moment"
                                className="w-full h-full min-h-[280px] md:min-h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8">
                                <h3 className="text-lg md:text-2xl font-extrabold text-white uppercase tracking-wider">Making Impact Together</h3>
                            </div>
                        </div>

                        {/* Medium photos */}
                        {volunteerPhotos.slice(1, 3).map((photo, index) => (
                            <div key={index} className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-500">
                                <img
                                    src={photo}
                                    alt="Volunteer moment"
                                    className="w-full h-32 md:h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-orange-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <Heart className="w-8 h-8 text-white fill-current animate-bounce" />
                                </div>
                            </div>
                        ))}

                        {/* Small photos */}
                        {volunteerPhotos.slice(3, 13).map((photo, index) => (
                            <div key={index} className="relative group overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-500">
                                <img
                                    src={photo}
                                    alt="Volunteer moment"
                                    className="w-full h-32 md:h-48 object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/50 group-hover:bg-[#F97316]/90 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 p-2 text-center">
                                    <span className="text-white font-bold text-xs md:text-sm uppercase tracking-wider">NSD Family</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



        </div>
    );
}

export default Home;