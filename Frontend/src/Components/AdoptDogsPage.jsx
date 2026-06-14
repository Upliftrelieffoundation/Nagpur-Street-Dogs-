import React, { useState } from 'react';
import { Search, MapPin, Heart, Filter, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScrollAnimate from '../Animation/ScrollAnimate';
import adopt1 from '../assets/adopt 1.jpeg';
import adopt2 from '../assets/adopt 2.jpeg';

const AdoptDogsPage = () => {
  const naviagate = useNavigate();

  const handleClicknaviageton = () => {
    naviagate('/adopt-form');
  };

  // Hardcoded adoption entries
  const dogs = [
    {
      _id: 'adopt-1',
      name: 'Puppy',
      images: [adopt1],
      age: 5,
      location: { city: 'Virar', state: 'West' },
      breed: 'Mixed Breed',
      size: 'Small',
      gender: 'Male',
      description: 'Adoption appeal — 5 month old male puppy. Vaccination done by our side. Located in Virar West. Contact: 9967477018',
      healthStatus: { vaccinated: true, neutered: false },
      urgent: false,
      contact: '9967477018'
    },
    {
      _id: 'adopt-2',
      name: 'Puppies',
      images: [adopt2],
      age: 3,
      location: { city: 'Virar', state: 'West' },
      breed: 'Mixed Breed',
      size: 'Small',
      gender: 'Female & Male',
      description: 'Adoption appeal — 3 month old female & male puppies. Vaccinated. Located in Virar West. Contact: 9967477018',
      healthStatus: { vaccinated: true, neutered: false },
      urgent: false,
      contact: '9967477018'
    }
  ];

  const getAgeString = (ageInMonths) => {
    if (ageInMonths < 12) {
      return `${ageInMonths} month${ageInMonths > 1 ? 's' : ''}`;
    }
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    return months > 0 ? `${years}y ${months}m` : `${years} year${years > 1 ? 's' : ''}`;
  };

  const DogCard = ({ dog }) => (
    <div className="glass-solid overflow-hidden hover:shadow-xl transition-all duration-500 border border-orange-100 group">
      <div className="relative">
        <img
          src={dog.images[0]}
          alt={dog.name}
          className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {dog.urgent && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Urgent
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">{dog.name}</h3>
          <span className="text-sm text-orange-600 font-medium">{getAgeString(dog.age)}</span>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1 text-orange-500" />
          <span className="text-sm">{dog.location.city}, {dog.location.state}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
            {dog.breed}
          </span>
          <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-full text-xs border border-orange-200">
            {dog.size}
          </span>
          <span className="bg-orange-200 text-orange-900 px-2 py-1 rounded-full text-xs">
            {dog.gender}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{dog.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {dog.healthStatus.vaccinated && (
              <span className="text-green-600 text-xs font-medium">✓ Vaccinated</span>
            )}
          </div>

          <a
            href={`tel:${dog.contact}`}
            className="glass-btn text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Phone className="w-4 h-4 mr-1 inline" /> Call
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-200 via-amber-50 to-amber-200 relative overflow-hidden">
      <div className="blob-orb-1 -top-40 -left-40 opacity-30"></div>
      <div className="blob-orb-2 -bottom-40 -right-40 opacity-30"></div>

      {/* Header */}
      <ScrollAnimate animation="fade-up">
      <div className="glass-navbar shadow-sm border-b border-orange-100 px-4 py-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Adopt a Street Dog</h1>
            <p className="text-orange-700 mt-1">Give a loving home to a dog in need</p>
          </div>
          <div>
            <button
              onClick={handleClicknaviageton}
              className="glass-btn text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow"
            >
              Find a Home for the Needy
            </button>
          </div>
        </div>
      </div>
      </ScrollAnimate>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Adoption Appeal Banner */}
        <ScrollAnimate animation="zoom-in">
        <div className="glass-solid p-6 mb-8 text-center border border-orange-100">
          <Heart className="w-12 h-12 text-orange-500 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Adoption Appeal</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These adorable puppies are looking for loving forever homes. If you're ready to open your heart and give a rescue dog the life they deserve, please reach out to us.
          </p>
        </div>
        </ScrollAnimate>

        {/* Dogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {dogs.map((dog, index) => (
            <ScrollAnimate key={dog._id} animation="fade-up" delay={index * 150}>
              <DogCard dog={dog} />
            </ScrollAnimate>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdoptDogsPage;
