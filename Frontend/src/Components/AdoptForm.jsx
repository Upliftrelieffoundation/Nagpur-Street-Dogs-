import React, { useEffect, useState } from 'react';
import { Camera, MapPin, Heart, AlertCircle, Phone, Mail, Upload, X } from 'lucide-react';
import { useContext } from 'react';
import { UserContext } from '../Authentication/Authentication';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddDogForm = () => {
  const navigate=useNavigate();
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    gender: '',
    size: '',
    color: '',
    description: '',
    images: [],
    healthStatus: {
      vaccinated: false,
      neutered: false,
      medicalHistory: ''
    },
    location: {
      city: '',
      state: '',
      pincode: '',
      address: ''
    },
    contactPreference: 'email',
    urgent: false,
    temperament: [],
    goodWith: {
      children: false,
      cats: false,
      dogs: false
    },
    energyLevel: 'Medium',
    specialNeeds: '',
    adoptionFee: 0,
    owner: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Indian states for dropdown
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
    'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi'
  ];

  // Major Indian cities for dropdown
  const majorCities = [
    'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune',
    'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
    'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad',
    'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali',
    'Vasai-Virar', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
    'Navi Mumbai', 'Allahabad', 'Howrah', 'Ranchi', 'Gwalior', 'Jabalpur',
    'Coimbatore', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota'
  ];

  const temperamentOptions = [
    'Friendly', 'Calm', 'Energetic', 'Playful', 'Gentle', 'Protective', 'Social', 'Independent'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleTemperamentChange = (temperament) => {
    setFormData(prev => ({
      ...prev,
      temperament: prev.temperament.includes(temperament)
        ? prev.temperament.filter(t => t !== temperament)
        : [...prev.temperament, temperament]
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length + formData.images.length > 5) {
      setErrors(prev => ({ ...prev, images: 'Maximum 5 images allowed' }));
      return;
    }

    const formDataForImages = new FormData();
    files.forEach(file => {
      formDataForImages.append('images', file);
    });

    setLoading(true);
    try {
      // Check if environment variable exists
      const serverDomain = import.meta?.env?.VITE_SERVER_DOMAIN;
      if (!serverDomain) {
        throw new Error('Server domain not configured');
      }

      const response = await fetch(`${serverDomain}/api/dog/upload-dog-images`, {
        method: 'POST',
        body: formDataForImages
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.imageUrls && Array.isArray(data.imageUrls)) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...data.imageUrls]
        }));
        setErrors(prev => ({ ...prev, images: '' }));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      setErrors(prev => ({ ...prev, images: error.message || 'Failed to upload images' }));
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) errors.push('Dog name is required');
    if (!formData.breed.trim()) errors.push('Breed is required');
    if (!formData.age || formData.age < 1) errors.push('Valid age is required ');
    if (!formData.gender) errors.push('Gender is required');
    if (!formData.size) errors.push('Size is required');
    if (!formData.color.trim()) errors.push('Color is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (formData.images.length === 0) errors.push('At least one image is required');
    if (!formData.location.city.trim()) errors.push('City is required');
    if (!formData.location.state.trim()) errors.push('State is required');
    if (!formData.location.pincode.trim()) errors.push('Pincode is required');

    // Show all validation errors as toast messages
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      breed: '',
      age: '',
      gender: '',
      size: '',
      color: '',
      description: '',
      images: [],
      healthStatus: {
        vaccinated: false,
        neutered: false,
        medicalHistory: ''
      },
      location: {
        city: '',
        state: '',
        pincode: ''
      },
      contactPreference: 'both',
      urgent: false,
      temperament: [],
      goodWith: {
        children: false,
        cats: false,
        dogs: false
      },
      energyLevel: 'Medium'
    });
  };
  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
  }, [user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(user==null){
      toast.error('Please sign in to post a dog for adoption');
      navigate('/signin'); 
      return;
    }
    formData.owner=user._id;
    // Clear previous errors
    setErrors({});
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Mock API call - replace with your actual API endpoint
     console.log(formData);
      const mockResponse = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/dog/createdog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      console.log(mockResponse);

      if (!mockResponse.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await mockResponse.json();
      
      if (data.success) {
        setSuccess(true);
        resetForm();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        // Handle server validation errors
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ submit: data.message || 'Failed to post dog for adoption' });
        }
      }
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border-2 border-orange-100">
          <div className="text-orange-500 mb-6">
            <Heart className="w-20 h-20 mx-auto fill-current" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Success!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">Your dog has been posted for adoption successfully. Thank you for helping find a loving home!</p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Post Another Dog
          </button>
        </div>
      </div>
    );
  }
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border-2 border-orange-100">
          <div className="text-orange-500 mb-6">
            <Heart className="w-20 h-20 mx-auto fill-current" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Success!</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">Your dog has been posted for adoption successfully. Thank you for helping find a loving home!</p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Post Another Dog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="glass-solid overflow-hidden border border-orange-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-8">
            <div className="flex items-center">
              <Heart className="w-8 h-8 mr-4" />
              <div>
                <h1 className="text-3xl font-bold">Post a Dog for Adoption</h1>
                <p className="mt-2 opacity-90 text-orange-100">Help find a loving home for a furry friend</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {errors.submit && (
              <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{errors.submit}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-orange-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-2 h-6 bg-orange-500 rounded mr-3"></div>
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dog's Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      errors.name ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="Enter dog's name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Breed *
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      errors.breed ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="e.g., Golden Retriever, Mixed Breed"
                  />
                  {errors.breed && <p className="text-red-500 text-sm mt-1">{errors.breed}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age (in months) *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="1"
                    max="300"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      errors.age ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="Age in months"
                  />
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender *
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === 'Male'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500 border-2 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-gray-700">Male</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === 'Female'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500 border-2 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-gray-700">Female</span>
                    </label>
                  </div>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Size *
                  </label>
                  <div className="space-y-2">
                    {['Small', 'Medium', 'Large'].map((sizeOption) => (
                      <label key={sizeOption} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="size"
                          value={sizeOption}
                          checked={formData.size === sizeOption}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-orange-500 border-2 border-gray-300 focus:ring-orange-500"
                        />
                        <span className="ml-2 text-gray-700">
                          {sizeOption} {sizeOption === 'Small' && '(< 25 lbs)'} 
                          {sizeOption === 'Medium' && '(25-60 lbs)'} 
                          {sizeOption === 'Large' && '(> 60 lbs)'}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Color *
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      errors.color ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="e.g., Brown, Black & White"
                  />
                  {errors.color && <p className="text-red-500 text-sm mt-1">{errors.color}</p>}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                  errors.description ? 'border-red-400' : 'border-gray-200'
                }`}
                placeholder="Tell us about the dog's personality, behavior, special needs, etc."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Temperament */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Temperament (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {temperamentOptions.map((temperament) => (
                  <label key={temperament} className="flex items-center cursor-pointer bg-white border-2 border-gray-200 rounded-lg p-3 hover:border-orange-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.temperament.includes(temperament)}
                      onChange={() => handleTemperamentChange(temperament)}
                      className="w-4 h-4 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{temperament}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Good With */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Good With
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[ 'cats', 'dogs'].map((option) => (
                  <label key={option} className="flex items-center cursor-pointer bg-orange-50 border-2 border-orange-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                    <input
                      type="checkbox"
                      name={`goodWith.${option}`}
                      checked={formData.goodWith[option]}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-3 text-gray-700 capitalize">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Energy Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Energy Level
              </label>
              <div className="flex space-x-4">
                {['Low', 'Medium', 'High'].map((level) => (
                  <label key={level} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="energyLevel"
                      value={level}
                      checked={formData.energyLevel === level}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-orange-500 border-2 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Photos * (Max 5)  
                <p>(Please upload clear images**)</p>
              </label>
              <div className="border-2 border-dashed border-orange-300 rounded-xl p-8 text-center bg-orange-50 hover:border-orange-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-orange-400 mb-4" />
                <div className="space-y-2">
                  <label htmlFor="images" className="cursor-pointer inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                    <Camera className="w-5 h-5 mr-2" />
                    Upload Photos
                    <input
                      id="images"
                      name="images"
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                </div>
              </div>
              {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
              
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Health Status */}
            <div className="bg-orange-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-2 h-6 bg-orange-500 rounded mr-3"></div>
                Health Information
              </h3>
              
              <div className="space-y-4">
                <label className="flex items-start cursor-pointer bg-white border-2 border-orange-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                  <input
                    type="checkbox"
                    name="healthStatus.vaccinated"
                    checked={formData.healthStatus.vaccinated}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500 mt-0.5"
                  />
                  <div className="ml-3">
                    <span className="text-gray-700 font-medium">Vaccinated</span>
                    <p className="text-sm text-gray-500">Please mention vaccination details in medical history if applicable</p>
                  </div>
                </label>

                <label className="flex items-start cursor-pointer bg-white border-2 border-orange-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                  <input
                    type="checkbox"
                    name="healthStatus.neutered"
                    checked={formData.healthStatus.neutered}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-orange-500 border-2 border-gray-300 rounded focus:ring-orange-500 mt-0.5"
                  />
                  <div className="ml-3">
                    <span className="text-gray-700 font-medium">Spayed/Neutered</span>
                  </div>
                </label>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Medical History (Optional)
                  </label>
                  <textarea
                    name="healthStatus.medicalHistory"
                    value={formData.healthStatus.medicalHistory}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Any medical conditions, treatments, or health notes..."
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-orange-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-3 text-orange-500" />
                Location
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <select
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      errors['location.city'] ? 'border-red-400' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select City</option>
                    {majorCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors['location.city'] && <p className="text-red-500 text-sm mt-1">{errors['location.city']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      errors['location.state'] ? 'border-red-400' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {errors['location.state'] && <p className="text-red-500 text-sm mt-1">{errors['location.state']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="location.pincode"
                    value={formData.location.pincode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      errors['location.pincode'] ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="Enter pincode"
                  />
                  {errors['location.pincode'] && <p className="text-red-500 text-sm mt-1">{errors['location.pincode']}</p>}
                </div>
              </div>
            </div>

            {/* Contact Preferences
            <div className="bg-orange-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-2 h-6 bg-orange-500 rounded mr-3"></div>
                Contact Preferences
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    How would you prefer to be contacted?
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer bg-white border-2 border-orange-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                      <input
                        type="radio"
                        name="contactPreference"
                        value="both"
                        checked={formData.contactPreference === 'both'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500 border-2 border-gray-300 focus:ring-orange-500"
                      />
                      <div className="ml-3 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-orange-500" />
                        <Mail className="w-4 h-4 mr-2 text-orange-500" />
                        <span className="text-gray-700">Phone or Email</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center cursor-pointer bg-white border-2 border-orange-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                      <input
                        type="radio"
                        name="contactPreference"
                        value="phone"
                        checked={formData.contactPreference === 'phone'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500 border-2 border-gray-300 focus:ring-orange-500"
                      />
                      <div className="ml-3 flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-orange-500" />
                        <span className="text-gray-700">Phone Only</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center cursor-pointer bg-white border-2 border-orange-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                      <input
                        type="radio"
                        name="contactPreference"
                        value="email"
                        checked={formData.contactPreference === 'email'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500 border-2 border-gray-300 focus:ring-orange-500"
                      />
                      <div className="ml-3 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-orange-500" />
                        <span className="text-gray-700">Email Only</span>
                      </div>
                    </label>
                  </div>
                </div>

                
              </div>
            </div> */}
            <label className="flex items-start cursor-pointer bg-white border-2 border-red-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                  <input
                    type="checkbox"
                    name="urgent"
                    checked={formData.urgent}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-red-500 border-2 border-gray-300 rounded focus:ring-red-500 mt-0.5"
                  />
                  <div className="ml-3">
                    <span className="text-red-700 font-medium flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Urgent Adoption Required
                    </span>
                    <p className="text-sm text-red-600">Check this if the dog needs immediate rehoming due to emergency circumstances</p>
                  </div>
                </label>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-8 rounded-xl text-white font-bold text-lg transition-all transform hover:scale-105 shadow-lg ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Posting Dog for Adoption...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Heart className="w-6 h-6 mr-3" />
                    Post Dog for Adoption
                  </div>
                )}
              </button>
            </div>

            <div className="text-center text-sm text-gray-500 pt-4">
              <p>By posting, you agree to help find a loving and responsible home for this dog.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDogForm;
