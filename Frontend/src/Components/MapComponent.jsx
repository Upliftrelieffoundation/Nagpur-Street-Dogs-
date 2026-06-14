import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import toast from 'react-hot-toast';

// Fix for default marker icons in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icons for different marker types
const createCustomIcon = (color) => {
  return new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const vetIcon = createCustomIcon('blue');
const lostDogIcon = createCustomIcon('red');

// Component to update map view when center changes
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

const MapComponent = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [vetClinics, setVetClinics] = useState([]);
  const [lostDogs, setLostDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showLostDogForm, setShowLostDogForm] = useState(false);
  const [showAddClinicForm, setShowAddClinicForm] = useState(false);

  const mapCenter = [21.1458, 79.0882];

  // Lost dog form state
  const [lostDogData, setLostDogData] = useState({
    name: '',
    description: '',
    breed: '',
    color: '',
    contact: '',
    dateLost: '',
    lat: '',
    lng: '',
  });

  // Add clinic form state
  const [clinicData, setClinicData] = useState({
    name: '',
    address: '',
    phone: '',
    hours: '',
    lat: '',
    lng: '',
  });

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          setUserLocation(mapCenter);
        }
      );
    }
  }, []);

  // Fetch data from backend
  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const backendUrl = import.meta.env.VITE_SERVER_DOMAIN || 'http://localhost:8000';
        const [lat, lng] = userLocation || mapCenter;

        let vetData = [];

        // Strategy: Try backend first (10s timeout), fallback to direct Overpass API
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          const vetResponse = await fetch(
            `${backendUrl}/api/overpass/vet-clinics?lat=${lat}&lng=${lng}&radius=25000`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (!vetResponse.ok) throw new Error('Backend returned error');
          vetData = await vetResponse.json();
        } catch (backendErr) {
          // Backend failed or timed out — fetch directly from Overpass API
          console.log('Backend unavailable, fetching directly from Overpass API...');
          const searchRadius = 25000;
          const query = `
            [out:json][timeout:30];
            (
              node["amenity"="veterinary"](around:${searchRadius},${lat},${lng});
              way["amenity"="veterinary"](around:${searchRadius},${lat},${lng});
              node["amenity"="animal_hospital"](around:${searchRadius},${lat},${lng});
              way["amenity"="animal_hospital"](around:${searchRadius},${lat},${lng});
              node["amenity"="animal_shelter"](around:${searchRadius},${lat},${lng});
              node["amenity"="animal_boarding"](around:${searchRadius},${lat},${lng});
              node["healthcare"="veterinary"](around:${searchRadius},${lat},${lng});
              node["shop"="pet"](around:${searchRadius},${lat},${lng});
            );
            out center;
          `;
          
          const overpassResponse = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: `data=${encodeURIComponent(query)}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });

          if (overpassResponse.ok) {
            const data = await overpassResponse.json();
            vetData = data.elements
              .filter((el) => el.lat || (el.center && el.center.lat))
              .map((el) => ({
                _id: `osm_${el.type}_${el.id}`,
                name: el.tags?.name || el.tags?.brand || 'Veterinary Clinic',
                lat: el.lat || el.center?.lat || lat,
                lng: el.lon || el.center?.lon || lng,
                address: el.tags?.['addr:street']
                  ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] || ''}, ${el.tags['addr:city'] || 'Nagpur'}`
                  : 'Nagpur',
                phone: el.tags?.phone || el.tags?.['contact:phone'] || null,
                hours: el.tags?.opening_hours || null,
                type: 'vet',
              }));
          }
        }

        if (cancelled) return;
        setVetClinics(vetData);
        if (vetData.length > 0) {
          toast.success(`Found ${vetData.length} vet clinics nearby!`, { icon: '🏥' });
        }

        // Fetch lost dogs from backend (with fallback)
        try {
          const lostController = new AbortController();
          const lostTimeout = setTimeout(() => lostController.abort(), 8000);
          const lostResponse = await fetch(`${backendUrl}/api/lost-dogs`, { signal: lostController.signal });
          clearTimeout(lostTimeout);
          if (lostResponse.ok) {
            const lostData = await lostResponse.json();
            if (cancelled) return;
            setLostDogs(lostData);
          }
        } catch {
          setLostDogs([
            { _id: '1', name: 'Max', lat: 21.1480, lng: 79.0920, description: 'Golden Retriever, last seen near Central Avenue', contact: '+91 9876543213', dateLost: '2025-01-10' },
            { _id: '2', name: 'Bella', lat: 21.1400, lng: 79.0850, description: 'German Shepherd, friendly, wearing blue collar', contact: '+91 9876543214', dateLost: '2025-01-12' },
          ]);
        }

        if (cancelled) return;
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        console.error('Error fetching map data:', err);
        // Even if everything fails, show the map without markers instead of an error
        setLoading(false);
        toast.error('Could not load nearby clinics. Please try again.');
      }
    };

    if (userLocation) {
      fetchData();
    }

    return () => {
      cancelled = true;
    };
  }, [userLocation]);

  // Handle lost dog form submission
  const handleLostDogSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_SERVER_DOMAIN || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/lost-dogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lostDogData),
      });

      if (response.ok) {
        const newDog = await response.json();
        setLostDogs([...lostDogs, newDog]);
        setLostDogData({ name: '', description: '', breed: '', color: '', contact: '', dateLost: '', lat: '', lng: '' });
        setShowLostDogForm(false);
        toast.success('Lost dog report submitted!', { icon: '🐕' });
      } else {
        const err = await response.json();
        toast.error(err.message || 'Failed to submit report');
      }
    } catch {
      toast.error('Failed to submit report');
    }
  };

  // Handle clinic form submission
  const handleClinicSubmit = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_SERVER_DOMAIN || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/vet-clinics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clinicData),
      });

      if (response.ok) {
        const newClinic = await response.json();
        setVetClinics([...vetClinics, newClinic]);
        setClinicData({ name: '', address: '', phone: '', hours: '', lat: '', lng: '' });
        setShowAddClinicForm(false);
        toast.success('Clinic added to the map!', { icon: '🏥' });
      } else {
        const err = await response.json();
        toast.error(err.message || 'Failed to add clinic');
      }
    } catch {
      toast.error('Failed to add clinic');
    }
  };

  const useMyLocation = () => {
    if (userLocation && userLocation !== mapCenter) {
      const [lat, lng] = userLocation;
      setLostDogData({ ...lostDogData, lat: lat.toFixed(6), lng: lng.toFixed(6) });
      setClinicData({ ...clinicData, lat: lat.toFixed(6), lng: lng.toFixed(6) });
      toast.success('Location filled from your current position!', { icon: '📍' });
    } else {
      toast.error('Location not available');
    }
  };

  const getFilteredMarkers = () => {
    const markers = [];
    if (activeFilter === 'all' || activeFilter === 'vet') {
      vetClinics.forEach((clinic) => {
        markers.push({ ...clinic, type: 'vet', icon: vetIcon });
      });
    }
    if (activeFilter === 'all' || activeFilter === 'lost') {
      lostDogs.forEach((dog) => {
        markers.push({ ...dog, type: 'lost', icon: lostDogIcon });
      });
    }
    return markers;
  };

  const filteredMarkers = getFilteredMarkers();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 relative overflow-hidden">
        <div className="blob-orb-1 top-20 left-20"></div>
        <div className="blob-orb-2 bottom-20 right-20"></div>
        <div className="blob-orb-3 top-1/2 left-1/2"></div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-700">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 relative overflow-hidden">
        <div className="blob-orb-1 top-20 left-20"></div>
        <div className="blob-orb-2 bottom-20 right-20"></div>
        <div className="glass-solid text-center p-8 max-w-md relative z-10 slide-up">
          <div className="text-6xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Map</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-4">Make sure the backend is running on port 8000</p>
          <button
            onClick={() => window.location.reload()}
            className="glass-btn text-white px-6 py-3 font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-8 px-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="blob-orb-1 -top-40 -left-40 opacity-60"></div>
      <div className="blob-orb-2 -bottom-40 -right-40 opacity-50"></div>
      <div className="blob-orb-3 top-1/3 right-10 opacity-40"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">🐾 Animal Rescue Map</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find nearby veterinary clinics and report lost dogs in your area.
          </p>
          {userLocation && userLocation !== mapCenter && (
            <p className="text-sm text-green-600 mt-2 fade-in-scale">📍 Using your current location</p>
          )}
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-4 mb-6 slide-up slide-up-delay-1">
          {[
            { key: 'all', label: '🗺️ Show All', activeColor: 'bg-orange-500' },
            { key: 'vet', label: '🏥 Vet Clinics', activeColor: 'bg-blue-500' },
            { key: 'lost', label: '🐕 Lost Dogs', activeColor: 'bg-red-500' },
          ].map((btn) => (
            <button
              key={btn.key}
              onClick={() => setActiveFilter(btn.key)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 liquid-ripple ${
                activeFilter === btn.key
                  ? `${btn.activeColor} text-white shadow-lg scale-105`
                  : `glass-solid text-gray-700 hover:scale-105`
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-8 mb-6 slide-up slide-up-delay-2">
          <div className="flex items-center gap-2 glass-solid px-4 py-2">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" alt="Vet" className="w-6 h-10" />
            <span className="text-gray-700 font-medium">Veterinary Clinic</span>
          </div>
          <div className="flex items-center gap-2 glass-solid px-4 py-2">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" alt="Lost" className="w-6 h-10" />
            <span className="text-gray-700 font-medium">Lost Dog Reported</span>
          </div>
        </div>

        {/* Map */}
        <div className="glass-solid p-4 mb-8 slide-up slide-up-delay-3">
          <div style={{ height: '600px', width: '100%', borderRadius: '16px' }}>
            <MapContainer
              center={userLocation || mapCenter}
              zoom={13}
              style={{ height: '100%', width: '100%', borderRadius: '12px' }}
            >
              <MapUpdater center={userLocation || mapCenter} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredMarkers.map((marker) => (
                <Marker key={marker._id} position={[marker.lat, marker.lng]} icon={marker.icon}>
                  <Popup>
                    {marker.type === 'vet' ? (
                      <div className="p-2 min-w-[200px]">
                        <h3 className="font-bold text-lg mb-2 text-blue-600">{marker.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">📍 {marker.address}</p>
                        {marker.phone && <p className="text-sm text-gray-600 mb-1">📞 {marker.phone}</p>}
                        {marker.hours && <p className="text-sm text-gray-600 mb-2">🕒 {marker.hours}</p>}
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={`https://www.openstreetmap.org/?mlat=${marker.lat}&mlon=${marker.lng}#map=16/${marker.lat}/${marker.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600"
                          >
                            View on Map
                          </a>
                          {marker.phone && (
                            <a href={`tel:${marker.phone}`} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600">
                              Call
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2 min-w-[200px]">
                        <h3 className="font-bold text-lg mb-2 text-red-600">🐕 Lost: {marker.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{marker.description}</p>
                        <p className="text-sm text-gray-600 mb-1">📅 {new Date(marker.dateLost).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-600 mb-2">📞 {marker.contact}</p>
                        <a href={`tel:${marker.contact}`} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600">
                          Report Sighting
                        </a>
                      </div>
                    )}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8 stagger-children">
          {/* Add Clinic */}
          <div className="glass-solid p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🏥 Add Your Veterinary Clinic</h3>
            {!showAddClinicForm ? (
              <>
                <p className="text-gray-600 mb-4">Add your clinic to help pet parents find quality care.</p>
                <button onClick={() => setShowAddClinicForm(true)} className="glass-btn text-white px-6 py-3 font-semibold">
                  Add Clinic
                </button>
              </>
            ) : (
              <form onSubmit={handleClinicSubmit} className="space-y-3">
                <input type="text" placeholder="Clinic Name" value={clinicData.name} onChange={(e) => setClinicData({ ...clinicData, name: e.target.value })} className="w-full px-4 py-2 glass-input" required />
                <input type="text" placeholder="Address" value={clinicData.address} onChange={(e) => setClinicData({ ...clinicData, address: e.target.value })} className="w-full px-4 py-2 glass-input" required />
                <input type="text" placeholder="Phone" value={clinicData.phone} onChange={(e) => setClinicData({ ...clinicData, phone: e.target.value })} className="w-full px-4 py-2 glass-input" required />
                <input type="text" placeholder="Hours" value={clinicData.hours} onChange={(e) => setClinicData({ ...clinicData, hours: e.target.value })} className="w-full px-4 py-2 glass-input" required />
                <div className="flex gap-2">
                  <input type="number" step="any" placeholder="Latitude" value={clinicData.lat} onChange={(e) => setClinicData({ ...clinicData, lat: e.target.value })} className="w-full px-4 py-2 glass-input" required />
                  <input type="number" step="any" placeholder="Longitude" value={clinicData.lng} onChange={(e) => setClinicData({ ...clinicData, lng: e.target.value })} className="w-full px-4 py-2 glass-input" required />
                </div>
                <button type="button" onClick={useMyLocation} className="w-full glass-solid px-4 py-2 hover:bg-gray-100 text-sm">📍 Use My Location</button>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 glass-btn text-white px-4 py-2 font-semibold">Submit</button>
                  <button type="button" onClick={() => setShowAddClinicForm(false)} className="flex-1 glass-solid px-4 py-2 hover:bg-gray-100">Cancel</button>
                </div>
              </form>
            )}
          </div>

          {/* Report Lost Dog */}
          <div className="glass-solid p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">🐕 Report a Lost Dog</h3>
            {!showLostDogForm ? (
              <>
                <p className="text-gray-600 mb-4">Report a lost dog so our community can help.</p>
                <button onClick={() => setShowLostDogForm(true)} className="glass-btn text-white px-6 py-3 font-semibold" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8))' }}>
                  Report Lost Dog
                </button>
              </>
            ) : (
              <form onSubmit={handleLostDogSubmit} className="space-y-3">
                <input type="text" placeholder="Dog's Name" value={lostDogData.name} onChange={(e) => setLostDogData({ ...lostDogData, name: e.target.value })} className="w-full px-4 py-2 glass-input" required />
                <textarea placeholder="Description" value={lostDogData.description} onChange={(e) => setLostDogData({ ...lostDogData, description: e.target.value })} className="w-full px-4 py-2 glass-input" rows={3} required />
                <div className="flex gap-2">
                  <input type="text" placeholder="Breed" value={lostDogData.breed} onChange={(e) => setLostDogData({ ...lostDogData, breed: e.target.value })} className="w-full px-4 py-2 glass-input" />
                  <input type="text" placeholder="Color" value={lostDogData.color} onChange={(e) => setLostDogData({ ...lostDogData, color: e.target.value })} className="w-full px-4 py-2 glass-input" />
                </div>
                <input type="tel" placeholder="Contact Phone" value={lostDogData.contact} onChange={(e) => setLostDogData({ ...lostDogData, contact: e.target.value })} className="w-full px-4 py-2 glass-input" required />
                <input type="date" placeholder="Date Lost" value={lostDogData.dateLost} onChange={(e) => setLostDogData({ ...lostDogData, dateLost: e.target.value })} className="w-full px-4 py-2 glass-input" required />
                <div className="flex gap-2">
                  <input type="number" step="any" placeholder="Latitude" value={lostDogData.lat} onChange={(e) => setLostDogData({ ...lostDogData, lat: e.target.value })} className="w-full px-4 py-2 glass-input" required />
                  <input type="number" step="any" placeholder="Longitude" value={lostDogData.lng} onChange={(e) => setLostDogData({ ...lostDogData, lng: e.target.value })} className="w-full px-4 py-2 glass-input" required />
                </div>
                <button type="button" onClick={useMyLocation} className="w-full glass-solid px-4 py-2 hover:bg-gray-100 text-sm">📍 Use My Location</button>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 glass-btn text-white px-4 py-2 font-semibold" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8))' }}>Submit</button>
                  <button type="button" onClick={() => setShowLostDogForm(false)} className="flex-1 glass-solid px-4 py-2 hover:bg-gray-100">Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
