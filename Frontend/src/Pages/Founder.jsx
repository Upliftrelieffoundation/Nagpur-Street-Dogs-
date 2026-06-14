import React from 'react';
import ScrollAnimate from '../Animation/ScrollAnimate';
import founderImg from '../assets/founderimg.png';

export default function Founder() {
  return (
    <div className="bg-[#F2D06B] min-h-screen w-full flex flex-col md:flex-row items-center justify-center pt-12 pb-16 md:pb-24 relative z-10 font-['Outfit']">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 px-6 relative">
        <ScrollAnimate animation="fade-right">
          <div className="w-full flex items-center justify-center relative">
            <img
              src={founderImg}
              alt="Aniruddh Lakha"
              className="rounded-[32px] shadow-xl w-[90vw] max-w-[460px] h-[360px] md:h-[520px] object-cover object-center border-4 border-white/30"
            />
          </div>
        </ScrollAnimate>
        <ScrollAnimate animation="fade-left" delay={200}>
          <div className="flex-1 flex flex-col justify-center w-full mt-6 md:mt-0">
            <div className="mb-4 text-left">
              <span className="block text-3xl md:text-5xl font-extrabold text-[#E15519] mb-1">
                Aniruddh Lakha
              </span>
              <span className="text-orange-600 font-semibold text-lg tracking-wide">
                Founder
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#E15519] mb-4">
              Founder's Note
            </h2>
            <div className="bg-white rounded-[32px] p-8 md:p-10 text-gray-700 text-[17px] text-left space-y-5 shadow-lg border border-orange-100/30">
              <p className="leading-relaxed">
                I'm Aniruddh Lakha, founder of Nagpur Street Dogs (NSD). I started this journey in 2020 at just 16 years old. During the COVID-19 lockdown, I saw street animals starving and decided to step up — feeding 10–15 dogs in my area, which grew to over 150.
              </p>
              <p className="leading-relaxed">
                In 2022, we went public on Instagram, built a team of 100+ volunteers, and launched initiatives like Free Water Pot Distribution, Vaccination Camps, and the Radium Belt Project — reducing street animal accidents by 30–40%. Together, we're building a safer, kinder world for street animals — one step at a time.
              </p>
            </div>
          </div>
        </ScrollAnimate>
      </div>
    </div>
  );
}
