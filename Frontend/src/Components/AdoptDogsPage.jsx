import React, { useState } from 'react';
import { Search, MapPin, Heart, X, Phone, Mail, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScrollAnimate from '../Animation/ScrollAnimate';

// Image Imports
import adopt1 from '../assets/adopt 1.jpeg';
import adopt2 from '../assets/adopt 2.jpeg';
import home2 from "../assets/home2.jpg";
import feedingDrive from "../assets/feedingDrive.jpg";
import waterPot from "../assets/waterPot.jpg";
import radiumBelt from "../assets/radiumBelt.jpg";
import vaccination from "../assets/vaccination.jpg";
import adoptionImg from "../assets/adoption.jpg";
import communityEvent from "../assets/communityEvent.jpg";

const AdoptDogsPage = () => {
  const navigate = useNavigate();
  const [selectedDog, setSelectedDog] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [applicantDetails, setApplicantDetails] = useState({
    name: '',
    email: '',
    phone: '',
    experience: 'no',
    homeType: 'apartment'
  });

  // Real adoption entries
  const dogs = [
    {
      _id: 'adopt-1',
      name: 'Sheru',
      images: [adopt1],
      age: '5 months',
      gender: 'Male',
      description: 'Adoption appeal - 5 month old male puppy named Sheru. Vaccination done by our side. Located in Virar West.',
      breed: 'Mixed Breed',
      size: 'Small',
      vaccinated: true,
      neutered: false,
      contact: '9967477018'
    },
    {
      _id: 'adopt-2',
      name: 'Luna & Leo',
      images: [adopt2],
      age: '3 months',
      gender: 'Female & Male',
      description: 'Adoption appeal - 3 month old female and male puppies named Luna & Leo. Vaccinated. Located in Virar West.',
      breed: 'Mixed Breed',
      size: 'Small',
      vaccinated: true,
      neutered: false,
      contact: '9967477018'
    }
  ];

  const handleApplyChange = (e) => {
    const { name, value } = e.target;
    setApplicantDetails(prev => ({ ...prev, [name]: value }));
  };

  const submitApplication = (e) => {
    e.preventDefault();
    if (!applicantDetails.name || !applicantDetails.email || !applicantDetails.phone) {
      alert("Please fill in all required fields.");
      return;
    }
    setApplicationSubmitted(true);
    setTimeout(() => {
      setApplicationSubmitted(false);
      setShowApplyModal(false);
      setSelectedDog(null);
      setApplicantDetails({ name: '', email: '', phone: '', experience: 'no', homeType: 'apartment' });
    }, 2000);
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
                • ADOPTION
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-manrope font-extrabold text-[#17251E] mb-6 leading-tight tracking-tight">
                Give a dog a forever home.
              </h1>
              <p className="text-base md:text-lg text-[#3A362E]/90 mb-8 leading-relaxed font-dm-sans max-w-xl">
                Every adoption gives a rescued dog a second chance at life.
              </p>
              <button 
                onClick={() => {
                  const el = document.getElementById('dogs-list');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#C1592A] hover:bg-[#D97706] text-[#FFF8EF] px-8 py-3.5 rounded-full font-dm-sans font-bold text-sm tracking-wide transition duration-300 shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                Find Your Companion
              </button>
            </ScrollAnimate>
          </div>

          {/* Right Column Image */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <ScrollAnimate animation="fade-left" delay={200}>
              <img
                src={adoptionImg}
                alt="Rescued dog hopeful portrait"
                className="w-full max-w-[480px] aspect-[4/3] object-cover rounded-[3rem] shadow-xl border border-[#E4DAC4]"
              />
            </ScrollAnimate>
          </div>

        </div>
      </section>

      {/* 2. Dogs Waiting For a Home Grid Section */}
      <section id="dogs-list" className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8 border-t border-[#E4DAC4]">
        <ScrollAnimate animation="fade-up">
          <div className="text-left mb-16">
            <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-[#17251E] tracking-tight">
              Meet the dogs waiting for a home.
            </h2>
          </div>
        </ScrollAnimate>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dogs.map((dog, index) => (
            <ScrollAnimate key={dog._id} animation="fade-up" delay={index * 100}>
              <div className="bg-[#FFFDF6] rounded-[2rem] border border-[#E4DAC4] overflow-hidden text-left flex flex-col h-full shadow-sm hover:shadow-md transition duration-300">
                {/* Photo container */}
                <div className="aspect-[4/3] w-full overflow-hidden border-b border-[#E4DAC4] relative">
                  <img
                    src={dog.images[0]}
                    alt={dog.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
                
                {/* Info block */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-manrope font-extrabold text-[#17251E] mb-2">{dog.name}</h3>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-4">
                    {dog.age} • {dog.gender}
                  </span>
                  <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed mb-6 flex-grow">
                    {dog.description}
                  </p>
                  <button
                    onClick={() => setSelectedDog(dog)}
                    className="text-[#C1592A] hover:text-[#D97706] font-dm-sans font-bold text-xs uppercase tracking-wider text-left underline underline-offset-8 decoration-2 cursor-pointer w-max"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </ScrollAnimate>
          ))}
        </div>
      </section>

      {/* 3. How adoption works Section */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8 border-t border-[#E4DAC4]">
        <ScrollAnimate animation="fade-up">
          <div className="text-left mb-16">
            <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-[#17251E] tracking-tight">
              How adoption works.
            </h2>
          </div>
        </ScrollAnimate>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <ScrollAnimate animation="fade-up" delay={0}>
            <div className="text-left">
              <span className="text-3xl md:text-4xl font-manrope font-extrabold text-[#C1592A] block mb-4">01</span>
              <h3 className="text-lg font-manrope font-extrabold text-[#17251E] mb-2">Choose a dog</h3>
              <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">Browse profiles and find your match.</p>
            </div>
          </ScrollAnimate>

          {/* Step 2 */}
          <ScrollAnimate animation="fade-up" delay={100}>
            <div className="text-left">
              <span className="text-3xl md:text-4xl font-manrope font-extrabold text-[#C1592A] block mb-4">02</span>
              <h3 className="text-lg font-manrope font-extrabold text-[#17251E] mb-2">Submit an application</h3>
              <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">Tell us about your home and family.</p>
            </div>
          </ScrollAnimate>

          {/* Step 3 */}
          <ScrollAnimate animation="fade-up" delay={200}>
            <div className="text-left">
              <span className="text-3xl md:text-4xl font-manrope font-extrabold text-[#C1592A] block mb-4">03</span>
              <h3 className="text-lg font-manrope font-extrabold text-[#17251E] mb-2">Meet & verification</h3>
              <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">A short visit and quick home check.</p>
            </div>
          </ScrollAnimate>

          {/* Step 4 */}
          <ScrollAnimate animation="fade-up" delay={300}>
            <div className="text-left">
              <span className="text-3xl md:text-4xl font-manrope font-extrabold text-[#C1592A] block mb-4">04</span>
              <h3 className="text-lg font-manrope font-extrabold text-[#17251E] mb-2">Bring them home</h3>
              <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">Welcome your new companion.</p>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* 4. Adoption FAQ Section */}
      <section className="py-16 md:py-24 max-w-4xl mx-auto px-6 border-t border-[#E4DAC4]">
        <ScrollAnimate animation="fade-up">
          <div className="text-left mb-16">
            <h2 className="text-3xl md:text-5xl font-manrope font-extrabold text-[#17251E] tracking-tight">
              Adoption FAQ
            </h2>
          </div>
        </ScrollAnimate>

        <div className="space-y-8 text-left">
          <div>
            <h4 className="text-lg font-manrope font-extrabold text-[#17251E] mb-2">How does the adoption process work?</h4>
            <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">You submit an application, meet the dog, pass a home check, then bring them home.</p>
          </div>
          <div className="border-t border-[#E4DAC4] pt-6">
            <h4 className="text-lg font-manrope font-extrabold text-[#17251E] mb-2">Is there an adoption fee?</h4>
            <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">A small fee covers vaccination and sterilization already provided.</p>
          </div>
          <div className="border-t border-[#E4DAC4] pt-6">
            <h4 className="text-lg font-manrope font-extrabold text-[#17251E] mb-2">Can I adopt from outside Nagpur?</h4>
            <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">Yes, we coordinate transport for adopters outside the city.</p>
          </div>
          <div className="border-t border-[#E4DAC4] pt-6">
            <h4 className="text-lg font-manrope font-extrabold text-[#17251E] mb-2">What happens after I submit an application?</h4>
            <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed">Our team reviews it and reaches out within a few days.</p>
          </div>
        </div>
      </section>

      {/* 5. Can't adopt? Help Banner Section */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto my-8">
        <ScrollAnimate animation="fade-up">
          <div className="bg-[#17251E] text-[#FFF8EF] p-12 md:p-16 rounded-[2.5rem] text-center shadow-lg relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-3xl md:text-5xl font-manrope font-extrabold leading-tight mb-8">
                Can't adopt? You can still help.
              </h3>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button 
                  onClick={() => navigate('/donate')}
                  className="bg-[#C1592A] hover:bg-[#D97706] text-[#FFF8EF] px-8 py-3.5 rounded-full font-dm-sans font-bold text-sm tracking-wide transition duration-300 shadow-md hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto"
                >
                  Donate
                </button>
                <button 
                  onClick={() => navigate('/volunteer')}
                  className="border border-[#FFF8EF] hover:bg-[#FFF8EF] hover:text-[#17251E] text-[#FFF8EF] px-8 py-3.5 rounded-full font-dm-sans font-bold text-sm tracking-wide transition duration-300 cursor-pointer w-full sm:w-auto"
                >
                  Volunteer
                </button>
              </div>
            </div>
          </div>
        </ScrollAnimate>
      </section>

      {/* 6. Dog Profile Detail Modal */}
      {selectedDog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
          <div className="bg-[#FFF8EF] text-[#17251E] rounded-3xl max-w-2xl w-full shadow-2xl relative border border-[#E4DAC4] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            
            {/* Close Button */}
            <button 
              onClick={() => {
                setSelectedDog(null);
                setShowApplyModal(false);
              }}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-700 hover:text-black w-8 h-8 rounded-full flex items-center justify-center shadow-sm z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Dog image column */}
              <div className="h-64 md:h-full min-h-[300px]">
                <img
                  src={selectedDog.images[0]}
                  alt={selectedDog.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Dog details column */}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-manrope font-extrabold mb-1">{selectedDog.name}</h3>
                  <span className="text-xs font-bold text-[#C1592A] uppercase tracking-wider block mb-4">
                    {selectedDog.age} • {selectedDog.gender}
                  </span>
                  
                  {/* Attributes list */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-dm-sans mb-6">
                    <div className="bg-[#EDE6D3]/40 p-3 rounded-xl border border-[#E4DAC4]">
                      <span className="text-gray-500 block">Breed</span>
                      <span className="font-bold text-[#17251E]">{selectedDog.breed}</span>
                    </div>
                    <div className="bg-[#EDE6D3]/40 p-3 rounded-xl border border-[#E4DAC4]">
                      <span className="text-gray-500 block">Size</span>
                      <span className="font-bold text-[#17251E]">{selectedDog.size}</span>
                    </div>
                    <div className="bg-[#EDE6D3]/40 p-3 rounded-xl border border-[#E4DAC4]">
                      <span className="text-gray-500 block">Vaccinated</span>
                      <span className="font-bold text-emerald-600">{selectedDog.vaccinated ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="bg-[#EDE6D3]/40 p-3 rounded-xl border border-[#E4DAC4]">
                      <span className="text-gray-500 block">Neutered</span>
                      <span className="font-bold text-emerald-600">{selectedDog.neutered ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  <p className="text-sm text-[#3A362E]/90 font-dm-sans leading-relaxed mb-6">
                    {selectedDog.description} Rani is fully socialized and waiting for a warm, protective home.
                  </p>
                </div>

                {!showApplyModal ? (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="w-full bg-[#C1592A] hover:bg-[#D97706] text-[#FFF8EF] py-3.5 rounded-2xl font-dm-sans font-bold text-sm tracking-wide transition shadow cursor-pointer"
                  >
                    Apply for Adoption
                  </button>
                ) : (
                  <form onSubmit={submitApplication} className="space-y-3.5 text-left border-t border-[#E4DAC4] pt-4">
                    <span className="text-xs font-bold text-[#C1592A] uppercase block mb-1">Application form</span>
                    <input
                      type="text"
                      name="name"
                      value={applicantDetails.name}
                      onChange={handleApplyChange}
                      placeholder="Your Name *"
                      className="w-full px-4 py-2 text-xs border border-[#E4DAC4] bg-[#FFF8EF] rounded-xl focus:outline-none focus:border-[#17251E] transition"
                    />
                    <input
                      type="email"
                      name="email"
                      value={applicantDetails.email}
                      onChange={handleApplyChange}
                      placeholder="Your Email *"
                      className="w-full px-4 py-2 text-xs border border-[#E4DAC4] bg-[#FFF8EF] rounded-xl focus:outline-none focus:border-[#17251E] transition"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={applicantDetails.phone}
                      onChange={handleApplyChange}
                      placeholder="Your Phone *"
                      className="w-full px-4 py-2 text-xs border border-[#E4DAC4] bg-[#FFF8EF] rounded-xl focus:outline-none focus:border-[#17251E] transition"
                    />
                    
                    <button
                      type="submit"
                      disabled={applicationSubmitted}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-[#FFF8EF] py-3 rounded-xl font-dm-sans font-bold text-xs tracking-wide transition shadow cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {applicationSubmitted ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Application Sent!
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdoptDogsPage;
