import React, { useState, useEffect, useRef } from 'react';
import { Heart, Users, Globe, Award, Shield, PawPrint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import img2020 from '../assets/2020.jpg';
import img2021 from '../assets/2021.jpg';
import img2022 from '../assets/2022.jpg';
import img2023 from '../assets/2023.jpg';
import img2024 from '../assets/2024.jpg';
import img2025 from '../assets/2025.jpg';

import home2 from "../assets/home2.jpg";
import feedingDrive from "../assets/feedingDrive.jpg";
import waterPot from "../assets/waterPot.jpg";
import radiumBelt from "../assets/radiumBelt.jpg";
import vaccination from "../assets/vaccination.jpg";
import adoption from "../assets/adoption.jpg";
import communityEvent from "../assets/communityEvent.jpg";

// Volunteer Photos
import volunteer1 from "/New photo/IMG-20250603-WA0046~2.jpg";
import volunteer2 from "/New photo/IMG-20241206-WA0109~2.jpg";
import volunteer3 from "/New photo/IMG-20250603-WA0050~2.jpg";
import volunteer4 from "/New photo/IMG-20250604-WA0012~2.jpg";
import volunteer5 from "/New photo/IMG-20250604-WA0024~2.jpg";

function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFF8EF] text-[#17251E] font-dm-sans selection:bg-[#C1592A]/20">
      
      {/* 1. Hero Section */}
      <section className="pt-4 pb-16 md:pt-6 md:pb-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <ScrollAnimate animation="fade-right">
              <span className="text-[#C1592A] text-xs font-bold uppercase tracking-widest block mb-4">
                • ABOUT US
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-manrope font-extrabold text-[#17251E] mb-6 leading-tight tracking-tight">
                Every street dog deserves a chance.
              </h1>
              <p className="text-base md:text-lg text-[#3A362E]/90 mb-8 leading-relaxed font-dm-sans max-w-xl">
                Nagpur Street Dogs is a community-driven initiative rescuing, treating and rehoming stray dogs across Nagpur - built by volunteers, vets and residents.
              </p>
              <button 
                onClick={() => {
                  const el = document.getElementById('be-part-change');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[#C1592A] hover:text-[#D97706] font-dm-sans font-bold text-sm tracking-wide transition underline underline-offset-8 decoration-2 cursor-pointer"
              >
                Get Involved
              </button>
            </ScrollAnimate>
          </div>

          {/* Right Column Image */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <ScrollAnimate animation="fade-left" delay={200}>
              <img
                src={volunteer4}
                alt="Volunteer helping street dog"
                className="w-full max-w-[480px] aspect-[3/4] object-cover rounded-[3rem] shadow-xl border border-[#E4DAC4]"
              />
            </ScrollAnimate>
          </div>

        </div>
      </section>

      {/* 2. Compassion & Community Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8 border-t border-[#E4DAC4]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column Image */}
          <div className="lg:col-span-6">
            <ScrollAnimate animation="fade-right">
              <img
                src={volunteer2}
                alt="Volunteer with rescued dog"
                className="w-full aspect-[4/3] object-cover rounded-[2.5rem] shadow-md border border-[#E4DAC4]"
              />
            </ScrollAnimate>
          </div>

          {/* Right Column Text */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <ScrollAnimate animation="fade-left" delay={200}>
              <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-[#17251E] mb-6 leading-tight">
                Built Around Compassion.<br/>Driven By Community.
              </h2>
              <p className="text-base md:text-lg text-[#3A362E]/90 leading-relaxed font-dm-sans max-w-xl">
                Nagpur Street Dogs works alongside volunteers, vets and local residents to rescue, treat and rehome stray dogs - building a safer, more compassionate city for every dog on its streets.
              </p>
            </ScrollAnimate>
          </div>

        </div>
      </section>

      {/* 3. Journey Timeline Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8 border-t border-[#E4DAC4]">
        <ScrollAnimate animation="fade-up">
          <div className="text-left mb-16">
            <span className="text-[#C1592A] text-xs font-bold uppercase tracking-widest block mb-4">• OUR JOURNEY</span>
            <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-[#17251E] tracking-tight">
              From one small act to a<br/>city-wide movement.
            </h2>
          </div>
        </ScrollAnimate>

        <div className="relative border-l-2 border-[#E4DAC4]/70 pl-8 md:pl-12 ml-4 md:ml-8 space-y-20 md:space-y-32">
          
          {/* Timeline Row 2020 */}
          <div className="relative">
            <div className="absolute -left-[41px] md:-left-[57px] w-4.5 h-4.5 rounded-full bg-[#C1592A] border-4 border-[#FFF8EF] top-1.5" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 text-left flex flex-col items-start">
                <ScrollAnimate animation="fade-right">
                  <span className="text-[#C1592A] text-2xl font-manrope font-extrabold block mb-2">2020</span>
                  <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mb-4">Where It All Began</h3>
                  <p className="text-sm md:text-base text-[#3A362E]/95 font-dm-sans leading-relaxed">
                    Started at age 16 with ₹200-₹300 per month, feeding and rescuing 10-15 street dogs in the neighbourhood. A small act of compassion became the beginning of a larger mission.
                  </p>
                </ScrollAnimate>
              </div>
              <div className="lg:col-span-6">
                <ScrollAnimate animation="fade-left" delay={200}>
                  <img src={img2020} alt="2020 milestone" className="w-full h-72 md:h-96 object-cover rounded-[2rem] border border-[#E4DAC4] shadow-sm" />
                </ScrollAnimate>
              </div>
            </div>
          </div>

          {/* Timeline Row 2021 (Reversed) */}
          <div className="relative">
            <div className="absolute -left-[41px] md:-left-[57px] w-4.5 h-4.5 rounded-full bg-[#C1592A] border-4 border-[#FFF8EF] top-1.5" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 lg:order-2 text-left flex flex-col items-start">
                <ScrollAnimate animation="fade-left">
                  <span className="text-[#C1592A] text-2xl font-manrope font-extrabold block mb-2">2021</span>
                  <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mb-4">Community Over Individual</h3>
                  <p className="text-sm md:text-base text-[#3A362E]/95 font-dm-sans leading-relaxed">
                    Created an Instagram community that brought together young animal lovers. Launched the first Radium Belt Distribution initiative in Nagpur to improve street-dog safety.
                  </p>
                </ScrollAnimate>
              </div>
              <div className="lg:col-span-6 lg:order-1">
                <ScrollAnimate animation="fade-right" delay={200}>
                  <img src={img2021} alt="2021 milestone" className="w-full h-72 md:h-96 object-cover rounded-[2rem] border border-[#E4DAC4] shadow-sm" />
                </ScrollAnimate>
              </div>
            </div>
          </div>

          {/* Timeline Row 2022 */}
          <div className="relative">
            <div className="absolute -left-[41px] md:-left-[57px] w-4.5 h-4.5 rounded-full bg-[#C1592A] border-4 border-[#FFF8EF] top-1.5" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 text-left flex flex-col items-start">
                <ScrollAnimate animation="fade-right">
                  <span className="text-[#C1592A] text-2xl font-manrope font-extrabold block mb-2">2022</span>
                  <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mb-4">Expanding Care Beyond Food</h3>
                  <p className="text-sm md:text-base text-[#3A362E]/95 font-dm-sans leading-relaxed">
                    A growing volunteer team launched the first Free Water Pot Distribution Drive, placing 100+ water pots across Nagpur during summer.
                  </p>
                </ScrollAnimate>
              </div>
              <div className="lg:col-span-6">
                <ScrollAnimate animation="fade-left" delay={200}>
                  <img src={img2022} alt="2022 milestone" className="w-full h-72 md:h-96 object-cover rounded-[2rem] border border-[#E4DAC4] shadow-sm" />
                </ScrollAnimate>
              </div>
            </div>
          </div>

          {/* Timeline Row 2023 (Reversed) */}
          <div className="relative">
            <div className="absolute -left-[41px] md:-left-[57px] w-4.5 h-4.5 rounded-full bg-[#C1592A] border-4 border-[#FFF8EF] top-1.5" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 lg:order-2 text-left flex flex-col items-start">
                <ScrollAnimate animation="fade-left">
                  <span className="text-[#C1592A] text-2xl font-manrope font-extrabold block mb-2">2023</span>
                  <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mb-4">Building a Street + Pet Dog Community</h3>
                  <p className="text-sm md:text-base text-[#3A362E]/95 font-dm-sans leading-relaxed">
                    Expanded beyond street-dog rescue by connecting pet owners and animal welfare. Introduced Dog Yoga Sessions, Sunday Community Feeding and Team Radium Drives.
                  </p>
                </ScrollAnimate>
              </div>
              <div className="lg:col-span-6 lg:order-1">
                <ScrollAnimate animation="fade-right" delay={200}>
                  <img src={img2023} alt="2023 milestone" className="w-full h-72 md:h-96 object-cover rounded-[2rem] border border-[#E4DAC4] shadow-sm" />
                </ScrollAnimate>
              </div>
            </div>
          </div>

          {/* Timeline Row 2024 */}
          <div className="relative">
            <div className="absolute -left-[41px] md:-left-[57px] w-4.5 h-4.5 rounded-full bg-[#C1592A] border-4 border-[#FFF8EF] top-1.5" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 text-left flex flex-col items-start">
                <ScrollAnimate animation="fade-right">
                  <span className="text-[#C1592A] text-2xl font-manrope font-extrabold block mb-2">2024</span>
                  <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mb-4">A City-Wide Impact</h3>
                  <p className="text-sm md:text-base text-[#3A362E]/95 font-dm-sans leading-relaxed">
                    Distributed 500+ water pots and installed 3000+ radium belts across Nagpur. Organised Vidarbha's first-ever Dog Holi Party.
                  </p>
                </ScrollAnimate>
              </div>
              <div className="lg:col-span-6">
                <ScrollAnimate animation="fade-left" delay={200}>
                  <img src={img2024} alt="2024 milestone" className="w-full h-72 md:h-96 object-cover rounded-[2rem] border border-[#E4DAC4] shadow-sm" />
                </ScrollAnimate>
              </div>
            </div>
          </div>

          {/* Timeline Row 2025 (Reversed) */}
          <div className="relative">
            <div className="absolute -left-[41px] md:-left-[57px] w-4.5 h-4.5 rounded-full bg-[#C1592A] border-4 border-[#FFF8EF] top-1.5" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 lg:order-2 text-left flex flex-col items-start">
                <ScrollAnimate animation="fade-left">
                  <span className="text-[#C1592A] text-2xl font-manrope font-extrabold block mb-2">2025</span>
                  <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mb-4">The Mission Continues</h3>
                  <p className="text-sm md:text-base text-[#3A362E]/95 font-dm-sans leading-relaxed">
                    The mission continues with new innovative and inclusive initiatives, driven by a growing youth-led community where every paw matters.
                  </p>
                </ScrollAnimate>
              </div>
              <div className="lg:col-span-6 lg:order-1">
                <ScrollAnimate animation="fade-right" delay={200}>
                  <img src={img2025} alt="2025 milestone" className="w-full h-72 md:h-96 object-cover rounded-[2rem] border border-[#E4DAC4] shadow-sm" />
                </ScrollAnimate>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Our Impact Statistics Banner */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto my-8">
        <ScrollAnimate animation="fade-up">
          <div className="bg-[#17251E] text-[#FFF8EF] p-8 md:p-12 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-lg">
            <div className="md:col-span-4 text-left">
              <h3 className="text-2xl md:text-3xl font-manrope font-extrabold leading-tight">
                Our Impact
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

      {/* 5. What We Do Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8 border-t border-[#E4DAC4]">
        <ScrollAnimate animation="fade-up">
          <div className="text-left mb-16">
            <span className="text-[#C1592A] text-xs font-bold uppercase tracking-widest block mb-4">• WHAT WE DO</span>
            <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-[#17251E] leading-tight">
              Where our work makes a<br/>difference.
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
                  <span className="text-base md:text-lg font-manrope font-extrabold text-[#FFF8EF] uppercase tracking-wider">rescue & emergency care</span>
                </div>
              </div>
              <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mt-6 mb-2">Rescue & Emergency Care</h3>
              <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">Rapid response to injured and at-risk dogs.</p>
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
                  <span className="text-base md:text-lg font-manrope font-extrabold text-[#FFF8EF] uppercase tracking-wider">medical support</span>
                </div>
              </div>
              <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mt-6 mb-2">Medical Support</h3>
              <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">Treatment, surgery and recovery with partner vets.</p>
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
                  <span className="text-base md:text-lg font-manrope font-extrabold text-[#FFF8EF] uppercase tracking-wider">sterilization</span>
                </div>
              </div>
              <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mt-6 mb-2">Sterilization</h3>
              <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">Humane population control for long-term welfare.</p>
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
                  <span className="text-base md:text-lg font-manrope font-extrabold text-[#FFF8EF] uppercase tracking-wider">community & awareness</span>
                </div>
              </div>
              <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mt-6 mb-2">Community & Awareness</h3>
              <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">Rabies awareness and resident engagement.</p>
            </div>
          </ScrollAnimate>

        </div>
      </section>

      {/* 6. Be Part of the Change Section */}
      <section id="be-part-change" className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8 border-t border-[#E4DAC4]">
        <ScrollAnimate animation="fade-up">
          <div className="text-left mb-16">
            <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-[#17251E] tracking-tight">
              Be Part Of The Change.
            </h2>
          </div>
        </ScrollAnimate>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1 */}
          <ScrollAnimate animation="fade-up" delay={0}>
            <div className="bg-[#FFFDF6] p-8 rounded-3xl border border-[#E4DAC4] text-left shadow-sm flex flex-col items-start h-full">
              <div className="w-4 h-4 rounded-full bg-[#1B3B2E]" />
              <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mb-2 mt-6">Volunteer</h3>
              <p className="text-sm text-[#3A362E]/85 font-dm-sans leading-relaxed">Give your time.</p>
              <button onClick={() => navigate('/volunteer')} className="text-[#17251E] hover:text-[#C1592A] font-bold text-xs mt-6 uppercase tracking-wider font-dm-sans transition-colors cursor-pointer">
                Learn More &rarr;
              </button>
            </div>
          </ScrollAnimate>

          {/* Card 2 */}
          <ScrollAnimate animation="fade-up" delay={100}>
            <div className="bg-[#FFFDF6] p-8 rounded-3xl border border-[#E4DAC4] text-left shadow-sm flex flex-col items-start h-full">
              <div className="w-4 h-4 rounded-full bg-[#C1592A]" />
              <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mb-2 mt-6">Donate</h3>
              <p className="text-sm text-[#3A362E]/85 font-dm-sans leading-relaxed">Support rescue, food and medical care.</p>
              <button onClick={() => navigate('/donate')} className="text-[#C1592A] hover:text-[#D97706] font-bold text-xs mt-6 uppercase tracking-wider font-dm-sans transition-colors cursor-pointer">
                Learn More &rarr;
              </button>
            </div>
          </ScrollAnimate>

          {/* Card 3 */}
          <ScrollAnimate animation="fade-up" delay={200}>
            <div className="bg-[#FFFDF6] p-8 rounded-3xl border border-[#E4DAC4] text-left shadow-sm flex flex-col items-start h-full">
              <div className="w-4 h-4 rounded-full bg-[#1B3B2E]" />
              <h3 className="text-xl font-manrope font-extrabold text-[#17251E] mb-2 mt-6">Adopt</h3>
              <p className="text-sm text-[#3A362E]/85 font-dm-sans leading-relaxed">Give a rescued dog a home.</p>
              <button onClick={() => navigate('/adopt')} className="text-[#17251E] hover:text-[#C1592A] font-bold text-xs mt-6 uppercase tracking-wider font-dm-sans transition-colors cursor-pointer">
                Learn More &rarr;
              </button>
            </div>
          </ScrollAnimate>

        </div>
      </section>

      {/* 7. Bottom Get Involved CTA Banner */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto my-8">
        <ScrollAnimate animation="fade-up">
          <div className="bg-[#17251E] text-[#FFF8EF] p-12 md:p-16 rounded-[2.5rem] text-center shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-3xl md:text-5xl font-manrope font-extrabold leading-tight mb-8">
                Together, We Can Give Every Dog A Better Tomorrow.
              </h3>
              <button 
                onClick={() => {
                  const el = document.getElementById('be-part-change');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#C1592A] hover:bg-[#D97706] text-[#FFF8EF] px-8 py-3.5 rounded-full font-dm-sans font-bold text-sm tracking-wide transition duration-300 shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                Get Involved
              </button>
            </div>
          </div>
        </ScrollAnimate>
      </section>

    </div>
  );
}

export default AboutUs;
