import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Heart, Calendar, User, Shield, Stethoscope } from 'lucide-react';

const DogDetailsPage = () => {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    fetchDogDetails();
  }, [id]);

  const fetchDogDetails = async () => {
    try {
      console.log(`Fetching dog details for ID: ${id}`);
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/dog/getdogs/${id}`, {
        method: 'GET',
        // headers: {
        //   'Content-Type': 'application/json'
        // }
      });
      const data = await response.json();
      
      if (data.success) {
        setDog(data.dog);
      }
    } catch (error) {
      console.error('Error fetching dog details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAgeString = (ageInMonths) => {
    if (ageInMonths < 12) {
      return `${ageInMonths} month${ageInMonths > 1 ? 's' : ''}`;
    }
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    return months > 0 ? `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}` : `${years} year${years > 1 ? 's' : ''}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dog details...</p>
        </div>
      </div>
    );
  }

  if (!dog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <Heart className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Dog not found</h2>
          <p className="text-gray-500">The dog you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }
  console.log(dog);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="glass-solid overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Gallery */}
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={dog.images[currentImageIndex] || '/api/placeholder/600/400'}
                  alt={dog.name}
                  className="w-full h-96 object-cover"
                />
              </div>
              
              {dog.images.length > 1 && (
                <div className="flex space-x-2 mt-4 px-4">
                  {dog.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${dog.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
              
              {dog.urgent && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full font-semibold">
                  Urgent Adoption Needed
                </div>
              )}
            </div>

            {/* Dog Information */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{dog.name}</h1>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-700">{getAgeString(dog.age)} old</p>
                  <p className="text-sm text-gray-500">Posted {formatDate(dog.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{dog.location.city}, {dog.location.state} - {dog.location.pincode}</span>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Breed</p>
                  <p className="font-semibold">{dog.breed}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="font-semibold">{dog.gender}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Size</p>
                  <p className="font-semibold">{dog.size}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Color</p>
                  <p className="font-semibold">{dog.color}</p>
                </div>
              </div>

              {/* Health Status */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Stethoscope className="w-5 h-5 mr-2" />
                  Health Status
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    dog.healthStatus.vaccinated 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {dog.healthStatus.vaccinated ? '✓ Vaccinated' : '✗ Not Vaccinated'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    dog.healthStatus.neutered 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'glass-solid/30 text-gray-800'
                  }`}>
                    {dog.healthStatus.neutered ? '✓ Neutered/Spayed' : '✗ Not Neutered/Spayed'}
                  </span>
                </div>
                {dog.healthStatus.medicalHistory && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Medical History:</p>
                    <p className="text-sm">{dog.healthStatus.medicalHistory}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">About {dog.name}</h3>
                <p className="text-gray-700 leading-relaxed">{dog.description}</p>
              </div>

              {/* Contact Button */}
              <div className="border-t pt-6">
                <button
                  onClick={() => setShowContact(!showContact)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors mb-4"
                >
                  {showContact ? 'Hide Contact Details' : 'Show Contact Details'}
                </button>

                {showContact && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {/* Owner Header with Image */}
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-200">
                        {dog.owner.image ? (
                          <img
                            src={dog.owner.image}
                            alt={dog.owner.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <User className="w-6 h-6 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">
                          Contact {dog.owner.name}
                        </h4>
                        <p className="text-sm text-gray-600">{dog.owner.occupation}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-sm">{dog.owner.email}</span>
                      </div>
                      
                      {dog.owner.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-3 text-gray-400" />
                          <span className="text-sm">{dog.owner.phone}</span>
                        </div>
                      )}
                      
                      {dog.owner.address && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                          <span className="text-sm">
                            {typeof dog.owner.address === 'string' 
                              ? dog.owner.address 
                              : `${dog.owner.address?.city || 'City not provided'}, ${dog.owner.address?.state || 'State not provided'}`
                            }
                          </span>
                        </div>
                      )}
                    </div>

                    {dog.contactPreference && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Preferred Contact:</strong> {
                            dog.contactPreference === 'both' ? 'Phone or Email' :
                            dog.contactPreference === 'phone' ? 'Phone Only' : 'Email Only'
                          }
                        </p>
                      </div>
                    )}

                    <div className="mt-4 flex space-x-3">
                      {(dog.contactPreference === 'phone' || dog.contactPreference === 'both' || !dog.contactPreference) && dog.owner.phone && (
                        <a
                          href={`tel:${dog.owner.phone}`}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-center font-medium transition-colors"
                        >
                          Call Now
                        </a>
                      )}
                      
                      {(dog.contactPreference === 'email' || dog.contactPreference === 'both' || !dog.contactPreference) && (
                        <a
                          href={`mailto:${dog.owner.email}?subject=Interested in adopting ${dog.name}&body=Hi ${dog.owner.name},%0D%0A%0D%0AI'm interested in adopting ${dog.name}. Could we please discuss the adoption process?%0D%0A%0D%0AThank you!`}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-center font-medium transition-colors"
                        >
                          Send Email
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 glass-solid p-6">
          <h3 className="text-xl font-semibold mb-4">Important Notes</h3>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  <strong>Adoption Guidelines:</strong> Please ensure you can provide a loving, safe environment for {dog.name}. 
                  Consider the long-term commitment of pet ownership including medical care, daily exercise, and companionship.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Meet Before Adopting:</strong> We strongly recommend meeting {dog.name} in person before making 
                  the adoption decision. This helps ensure compatibility and gives you a chance to ask any questions 
                  about their care, behavior, and needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogDetailsPage;
