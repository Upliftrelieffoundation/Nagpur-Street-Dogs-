import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollAnimate from '../Animation/ScrollAnimate';
import goodDoggy from "/home3.png";
import { 
  ChevronDown, 
  Heart, 
  Users, 
  Target, 
  PawPrint, 
  Home, 
  Shield, 
  Dog, 
  BookOpen,
  PlusCircle, 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import img2020 from '../assets/2020.jpg';
import img2021 from '../assets/2021.jpg';
import img2022 from '../assets/2022.jpg';
import img2023 from '../assets/2023.jpg';
import img2024 from '../assets/2024.jpg';
import img2025 from '../assets/2025.jpg';

// Timeline data for each year with images and updated content
const journeyTimeline = [
  {
    year: '2020',
    title: 'Where It All Began',
    img: img2020,
    text: `At just 16 years old, a young animal lover from Nagpur took the first step toward a bigger vision—ensuring care for the voiceless. With only ₹200-₹300 a month from his pocket money, he began feeding and rescuing 10–15 street dogs in his neighborhood. What started as a small act of compassion soon planted the seeds of a movement.`
  },
  {
    year: '2021',
    title: 'Community Over Individual',
    img: img2021,
    text: `Encouraged by a friend, he created an Instagram page to build a like-minded community of young animal lovers. Slowly, passionate students joined the mission. This year marked our first public impact initiative—Radium Belt Distribution for street dogs to prevent night-time accidents, a first-of-its-kind in Nagpur. This initiative became the turning point for our growing presence.`
  },
  {
    year: '2022',
    title: 'Expanding Care Beyond Food',
    img: img2022,
    text: `With more volunteers joining the cause, we realized that food and rescue alone weren’t enough—access to clean drinking water during Nagpur’s scorching summers was a major issue. With a self-funded team of 10 members, we launched our first Free Water Pot Distribution Drive, placing over 100+ pots across the city. The number may have been small, but the impact was immense.`
  },
  {
    year: '2023',
    title: 'Building a Street + Pet Dog Community',
    img: img2023,
    text: `This year, our vision expanded beyond street dogs. We dreamed of building a bridge between pet owners and street animal welfare. While we continued our key initiatives like radium belt and water pot distribution, we also introduced Dog Yoga Sessions, Sunday Community Feeding, and Team Radium Drives. With over 50 active volunteers, we began conducting regular team meetings to brainstorm and plan bigger initiatives.`
  },
  {
    year: '2024',
    title: 'A City-Wide Impact',
    img: img2024,
    text: `This was our breakthrough year. We led Nagpur’s largest self-funded water pot drive, distributing 500+ water pots and installing 3000+ radium belts, directly saving countless lives. We also organized Vidarbha’s First-Ever Dog Holi Party, celebrating our community of pet and street dog lovers alike. Our vision became a city-wide movement.`
  },
  {
    year: '2025',
    title: 'The Mission Continues...',
    img: img2025,
    text: `We're only getting started. With many more innovative, inclusive, and impactful initiatives in the pipeline, Nagpur Street Dogs continues to stand as a youth-led force of compassion, creating a city where every paw matters.`
  },
];

const AboutUs = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [showFullStory, setShowFullStory] = useState(false);
  const navigate = useNavigate();

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? "null" : section);
  };

  const toggleInitiative = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Only keep volunteers in sectionData for the expandable section
  const sectionData = {
    volunteers: {
      icon: <Users className="w-5 h-5" />,
      title: 'Our Volunteers',
      content: 'Our incredible team of dedicated volunteers is the heart of our organization. From veterinarians and foster families to fundraisers and advocates, each volunteer brings unique skills and unwavering commitment to our cause.'
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#FFEAD0] via-[#FFF8F0] to-[#FFEAD0] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section */}
        <ScrollAnimate animation="fade-up">
        <div className="text-center mb-16 md:mb-24">
          <div className="inline-flex items-center justify-center mb-6 bg-[#FFF6EB]/95 text-[#EA580C] border border-orange-200/50 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
            <PawPrint className="w-4 h-4 mr-2 text-orange-500 fill-current" />
            ABOUT OUR ORGANIZATION
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
            Changing <span className="text-[#F97316]">Lives</span>,<br />
            One <span className="text-[#F97316]">Paw</span> at a Time
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We are a passionate community dedicated to rescuing, rehabilitating, and rehome stray dogs with love, compassion, and professionalism.
          </p>
        </div>
        </ScrollAnimate>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch mb-16 md:mb-24">
          <ScrollAnimate animation="fade-right">
          <div className="h-full flex flex-col justify-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-1.5 bg-[#F97316] rounded-full inline-block"></span>
                Our Story
              </h2>
              <div className="space-y-4">
                <div className="text-gray-700 text-lg leading-relaxed space-y-4">
                  {showFullStory ? (
                    <>
                      <p>
                        Nagpur Street Dogs was founded by a 16-year-old boy in 2020. It is a self-funded youth-driven community dedicated to the welfare, protection, and dignity of street animals across Nagpur. Founded with compassion and driven by action, our mission is to give a voice to the voiceless and build a more humane world—one paw at a time.
                      </p>
                      <p>
                        We work actively on the streets to rescue, rehabilitate, and care for injured, abandoned, and sick dogs. Beyond rescue, we focus on long-term impact through sterilization, vaccination drives, feeding programs, and awareness campaigns.<br/>
                        NSD is the 1st group in Nagpur city to distribute free water pots every summer. Every summer, we run <b>free water pot distribution</b> drives across Nagpur to ensure that animals have access to clean drinking water during scorching heatwaves—a life-saving initiative supported by our incredible team and community collaborators.<br/>
                        NSD is the only group to provide <b>Radium belts</b> to the street dogs to reduce the accident cases in Nagpur.
                      </p>
                      <p>
                        Our strength lies in our passionate volunteers, everyday heroes who believe in kindness without conditions. We proudly collaborate with local cafés, small businesses, influencers, educational institutions, and socially conscious brands to build a better environment for our furry friends.
                      </p>
                      <p>
                        At Nagpur Street Dogs, we believe that street animals are not a problem to be solved but lives to be protected. <b>Join us</b> in making Nagpur a safer, kinder place for all beings.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        Nagpur Street Dogs was founded by a 16-year-old boy in 2020. It is a self-funded youth-driven community dedicated to the welfare, protection, and dignity of street animals across Nagpur. Founded with compassion and driven by action, our mission is to give a voice to the voiceless and build a more humane world—one paw at a time.
                        <button onClick={() => setShowFullStory(true)} className="ml-2 text-orange-600 underline hover:text-orange-800 font-bold cursor-pointer">Read more</button>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Vertical Metrics Stack with Icon Circles */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFF6EB] flex items-center justify-center text-[#F97316] border border-orange-100/50 shadow-sm">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <span className="text-gray-700 text-sm md:text-base font-semibold">
                  <strong className="text-[#F97316] font-black text-base md:text-lg mr-1">950+</strong> Dogs Rescued
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFF6EB] flex items-center justify-center text-[#F97316] border border-orange-100/50 shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-gray-700 text-sm md:text-base font-semibold">
                  <strong className="text-[#F97316] font-black text-base md:text-lg mr-1">150+</strong> Active Volunteers
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFF6EB] flex items-center justify-center text-[#F97316] border border-orange-100/50 shadow-sm">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-gray-700 text-sm md:text-base font-semibold">
                  <strong className="text-[#F97316] font-black text-base md:text-lg mr-1">98%</strong> Adoption Success
                </span>
              </div>
            </div>
          </div>
          </ScrollAnimate>
          
          <ScrollAnimate animation="fade-left" delay={200}>
          <div className="flex items-center justify-center h-full min-h-[350px] lg:min-h-full">
            <img
              src={goodDoggy}
              alt="About us"
              className="w-full h-full object-contain drop-shadow-md transition-transform duration-500 hover:scale-[1.02]"
              style={{ maxWidth: '90%', maxHeight: '450px' }}
            />
          </div>
          </ScrollAnimate>
        </div>


        {/* Our Vision & Mission - always visible */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <ScrollAnimate animation="fade-right">
          <div className="bg-white p-8 rounded-3xl shadow-[0_15px_40px_-15px_rgba(249,115,22,0.08)] border border-orange-100/30 transition-all duration-300 hover:shadow-[0_20px_50px_-10px_rgba(249,115,22,0.12)] hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FFF6EB] flex items-center justify-center text-[#F97316] border border-orange-100/50 shadow-sm">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Our Vision</h3>
            </div>
            <div className="text-gray-600 leading-relaxed text-base md:text-lg">
              Our vision is to make Nagpur a model city for street animal welfare—a place where humans and animals coexist in harmony, safety, and mutual respect.<br/>
              We envision a future where:
              <ul className="space-y-3 mt-4">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-2.5 flex-shrink-0"></span>
                  <span>No stray animal goes hungry, untreated, or ignored.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-2.5 flex-shrink-0"></span>
                  <span>Every citizen is aware and involved in animal welfare.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-2.5 flex-shrink-0"></span>
                  <span>Rescues, treatments, and sterilizations are supported by strong community and volunteer networks.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-2.5 flex-shrink-0"></span>
                  <span>Street animal deaths due to accidents and neglect are drastically reduced through sustainable, preventive solutions.</span>
                </li>
              </ul>
              <br/>
              We believe real change starts at the grassroots—with empathy, education, and action. Through Nagpur Street Dogs, we aspire to ignite that change and set an example for other cities to follow.
            </div>
          </div>
          </ScrollAnimate>
          <ScrollAnimate animation="fade-left" delay={200}>
          <div className="bg-white p-8 rounded-3xl shadow-[0_15px_40px_-15px_rgba(249,115,22,0.08)] border border-orange-100/30 transition-all duration-300 hover:shadow-[0_20px_50px_-10px_rgba(249,115,22,0.12)] hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FFF6EB] flex items-center justify-center text-[#F97316] border border-orange-100/50 shadow-sm">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Our Mission</h3>
            </div>
            <div className="text-gray-600 leading-relaxed text-base md:text-lg space-y-4">
              <p>
                At Nagpur Street Dogs, our mission is to create a compassionate and safe environment for street animals by focusing on rescue, rehabilitation, feeding, medical care, sterilization, and awareness. We are committed to being the voice for the voiceless by ensuring that every stray animal in Nagpur gets the right to live with dignity and care.
              </p>
              <p>
                Through community-driven efforts, we aim to reduce suffering, prevent cruelty, and inspire responsible action among citizens. Our initiatives—like feeding drives, vaccination camps, radium belt installations, and water pot distributions—are designed not just to help animals survive, but to thrive. We believe in education, collaboration, and action as key tools to build a more inclusive and humane society.
              </p>
            </div>
          </div>
          </ScrollAnimate>
        </div>

        {/* Volunteers - still expandable */}
        {/**
        <div className="flex flex-wrap justify-center gap-4 mb-12 md:mb-16">
          <button
            onClick={() => toggleSection('volunteers')}
            className={`flex items-center gap-3 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
              expandedSection === 'volunteers'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg'
                : 'bg-white text-orange-600 border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50'
            }`}
          >
            <Users className="w-5 h-5" />
            Our Volunteers
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedSection === 'volunteers' ? 'rotate-180' : ''}`} />
          </button>
        </div>
        **/}

        {/* {expandedSection === 'volunteers' && (
          <div className="mb-12 md:mb-16 animate-fadeIn transition-all duration-200">
            <div className="bg-white p-8 rounded-3xl shadow-xl border-l-4 border-orange-500 hover:shadow-2xl transition-shadow">
              <h3 className="text-2xl font-bold text-orange-600 mb-4 flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-full">
                  <Users className="w-5 h-5" />
                </div>
                Our Volunteers
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Our incredible team of dedicated volunteers is the heart of our organization. From veterinarians and foster families to fundraisers and advocates, each volunteer brings unique skills and unwavering commitment to our cause.
              </p>
            </div>
          </div>
        )} */}


        {/* Animated Timeline: Our Journey – Nagpur Street Dogs */}
        <div className="relative mb-24 max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#EA580C] text-sm font-extrabold uppercase tracking-widest block mb-3">Timeline</span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
              Our Journey – <span className="text-[#F97316]">Nagpur Street Dogs</span>
            </h2>
          </div>
          <div className="relative pl-8 md:pl-10 border-l-4 border-orange-200/60 ml-2 md:ml-4">
            {journeyTimeline.map((item, idx) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
                className="mb-16 relative"
              >
                {/* Timeline Dot on Axis */}
                <div className="absolute -left-[38px] md:-left-[46px] top-1.5 w-5 h-5 bg-[#F97316] rounded-full border-4 border-white shadow-md z-10"></div>
                
                {/* Content Container */}
                <div className="flex flex-col">
                  <h3 className="text-xl md:text-2xl font-black text-[#F97316] mb-2 tracking-tight">
                    {item.year}: {item.title}
                  </h3>
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4">
                    {item.text}
                  </p>
                  
                  {/* Journey Image under Description */}
                  {item.img && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="mt-2"
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full max-w-md h-56 object-cover rounded-2xl shadow-md border-4 border-white transition-all duration-300 hover:scale-[1.01]"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <ScrollAnimate animation="zoom-in">
          <div className="mt-20 text-center bg-gradient-to-r from-orange-500 to-amber-500 text-white py-16 px-8 md:p-16 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full"></div>
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full"></div>
            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Ready to Make a Difference?</h3>
              <p className="text-lg md:text-xl mb-10 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Join our mission to save lives and create happy endings for dogs in need.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => navigate('/donate')}
                  className="bg-[#FACC15] hover:bg-[#EAB308] text-gray-900 px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:scale-105 flex items-center gap-2 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-current text-orange-600" />
                  Donate Now
                </button>
              </div>
            </div>
          </div>
        </ScrollAnimate>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </section>
  );
};

export default AboutUs;
