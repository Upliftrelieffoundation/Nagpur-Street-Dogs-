import React from 'react';
import ScrollAnimate from '../Animation/ScrollAnimate';
import founderImg from '../assets/founderimg.png';

export default function Founder() {
  return (
    <div className="bg-[#17251E] min-h-screen w-full flex items-center justify-center py-16 md:py-24 relative z-10 font-dm-sans">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image wrapper with white border */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <ScrollAnimate animation="fade-right">
              <div className="border-8 border-[#FFF8EF] rounded-[3.5rem] overflow-hidden shadow-2xl bg-[#FFF8EF]">
                <img
                  src={founderImg}
                  alt="Aniruddh Lakha holding a dog"
                  className="w-full max-w-[420px] aspect-[4/5] object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
            </ScrollAnimate>
          </div>

          {/* Right Column: Founder details and note */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <ScrollAnimate animation="fade-left" delay={200}>
              <h1 className="text-5xl md:text-7xl font-manrope font-extrabold text-[#C1592A] mb-1">
                Aniruddh Lakha
              </h1>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C1592A] block mb-8">
                Founder
              </span>

              <h2 className="text-2xl md:text-3xl font-manrope font-extrabold text-[#C1592A] mb-4">
                Founder's Note
              </h2>
              
              {/* White Letter Container */}
              <div className="bg-[#FFF8EF] rounded-[2.5rem] p-8 md:p-12 text-[#17251E] text-sm md:text-base leading-relaxed space-y-6 shadow-sm border border-[#E4DAC4]">
                <p>
                  I'm Aniruddh Lakha, founder of Nagpur Street Dogs (NSD). I started this journey in 2020 at just 16 years old. During the COVID-19 lockdown, I saw street animals starving and decided to step up - feeding 10-15 dogs in my area, which grew to over 150.
                </p>
                <p>
                  In 2022, we went public on Instagram, built a team of 100+ volunteers, and launched initiatives like Free Water Pot Distribution, Vaccination Camps, and the Radium Belt Project - reducing street animal accidents by 30-40%. Together, we're building a safer, kinder world for street animals - one step at a time.
                </p>
              </div>
            </ScrollAnimate>
          </div>

        </div>
      </div>
    </div>
  );
}
