import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, Plus, Minus, Check, MapPin, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ScrollAnimate from '../Animation/ScrollAnimate';

// Custom icons using standard HTML DivIcon matching Figma pins
const vetIcon = new L.DivIcon({
  className: 'custom-vet-marker',
  html: '<div class="w-5 h-5 rounded-full bg-[#1B3B2E] border-2 border-[#FFF8EF] flex items-center justify-center shadow-md cursor-pointer"><div class="w-1.5 h-1.5 rounded-full bg-[#FFF8EF]"></div></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10]
});

const lostDogIcon = new L.DivIcon({
  className: 'custom-lost-marker',
  html: '<div class="w-5 h-5 rounded-full bg-[#C1592A] border-2 border-[#FFF8EF] flex items-center justify-center shadow-md cursor-pointer"><div class="w-1.5 h-1.5 rounded-full bg-[#FFF8EF]"></div></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10]
});

// Component to dynamically update map view when center or zoom changes
function MapUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Controller component to bridge external custom zoom buttons to Leaflet instance
function MapZoomController({ zoomTrigger }) {
  const map = useMap();
  useEffect(() => {
    if (zoomTrigger === 'in') {
      map.zoomIn();
    } else if (zoomTrigger === 'out') {
      map.zoomOut();
    }
  }, [zoomTrigger, map]);
  return null;
}

const MapComponent = () => {
  const [activeFilter, setActiveFilter] = useState('all'); // all, vet, lost
  const [vetClinics, setVetClinics] = useState([]);
  const [lostDogs, setLostDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(13);
  const [zoomTrigger, setZoomTrigger] = useState(null);

  // Modals state
  const [showAddClinicModal, setShowAddClinicModal] = useState(false);
  const [showLostDogModal, setShowLostDogModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mapCenter = [21.1458, 79.0882]; // Nagpur Center coordinates

  // Form states
  const [clinicData, setClinicData] = useState({
    name: '',
    address: '',
    phone: '',
    hours: '',
    lat: '21.1458',
    lng: '79.0882'
  });

  const [lostDogData, setLostDogData] = useState({
    name: '',
    description: '',
    breed: '',
    color: '',
    contact: '',
    dateLost: new Date().toISOString().split('T')[0],
    lat: '21.1458',
    lng: '79.0882'
  });

  // Get current user location
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
    } else {
      setUserLocation(mapCenter);
    }
  }, []);

  // Fetch Vet Clinics & Lost Dogs
  useEffect(() => {
    if (!userLocation) return;

    let cancelled = false;
    const fetchData = async () => {
      try {
        const backendUrl = import.meta.env.VITE_SERVER_DOMAIN || 'https://nsd-backend-api.vercel.app';
        const [lat, lng] = userLocation;

        let vetData = [];

        // Step 1: Fetch clinics with Overpass fallback
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          
          const vetResponse = await fetch(
            `${backendUrl}/api/overpass/vet-clinics?lat=${lat}&lng=${lng}&radius=25000`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (vetResponse.ok) {
            vetData = await vetResponse.json();
          } else {
            throw new Error();
          }
        } catch {
          // Direct fallback to Overpass API
          const query = `
            [out:json][timeout:25];
            (
              node["amenity"="veterinary"](around:25000,${lat},${lng});
              way["amenity"="veterinary"](around:25000,${lat},${lng});
              node["healthcare"="veterinary"](around:25000,${lat},${lng});
            );
            out center;
          `;
          const overpassResponse = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: `data=${encodeURIComponent(query)}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });

          if (overpassResponse.ok) {
            const osmJson = await overpassResponse.json();
            vetData = osmJson.elements
              .filter((el) => el.lat || (el.center && el.center.lat))
              .map((el) => ({
                _id: `osm_${el.id}`,
                name: el.tags?.name || 'Veterinary Clinic',
                lat: el.lat || el.center?.lat,
                lng: el.lon || el.center?.lon,
                address: el.tags?.['addr:street']
                  ? `${el.tags['addr:street']}, Nagpur`
                  : 'Nagpur',
                phone: el.tags?.phone || null,
                hours: el.tags?.opening_hours || 'Open 24 hours',
                type: 'vet'
              }));
          }
        }

        if (cancelled) return;
        setVetClinics(vetData);

        // Step 2: Fetch lost dogs
        try {
          const lostResponse = await fetch(`${backendUrl}/api/lost-dogs`);
          if (lostResponse.ok) {
            const lostData = await lostResponse.json();
            if (!cancelled) setLostDogs(lostData);
          } else {
            throw new Error();
          }
        } catch {
          // Local static mock lost dogs matching mockup
          if (!cancelled) {
            setLostDogs([
              {
                _id: 'lost-1',
                name: 'Max',
                lat: lat + 0.005,
                lng: lng - 0.006,
                description: 'Golden retriever wearing blue collar. Friendly.',
                contact: '+91 9967477018',
                dateLost: '2026-08-10'
              },
              {
                _id: 'lost-2',
                name: 'Rocky',
                lat: lat - 0.004,
                lng: lng + 0.007,
                description: 'White indie dog, injured hind leg. Scared.',
                contact: '+91 9967477018',
                dateLost: '2026-08-12'
              }
            ]);
          }
        }

        if (!cancelled) setLoading(false);
      } catch (err) {
        console.error(err);
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [userLocation]);

  // Form handlers
  const handleClinicSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const backendUrl = import.meta.env.VITE_SERVER_DOMAIN || 'https://nsd-backend-api.vercel.app';
      const response = await fetch(`${backendUrl}/api/vet-clinics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clinicData)
      });

      if (response.ok) {
        const newClinic = await response.json();
        setVetClinics(prev => [...prev, newClinic]);
        toast.success('Clinic added successfully!');
        setShowAddClinicModal(false);
        setClinicData({ name: '', address: '', phone: '', hours: '', lat: '21.1458', lng: '79.0882' });
      } else {
        throw new Error();
      }
    } catch {
      // Mock insert on local state if offline
      const mockClinic = {
        _id: 'mock-clinic-' + Date.now(),
        name: clinicData.name,
        address: clinicData.address,
        phone: clinicData.phone,
        hours: clinicData.hours,
        lat: parseFloat(clinicData.lat),
        lng: parseFloat(clinicData.lng),
        type: 'vet'
      };
      setVetClinics(prev => [...prev, mockClinic]);
      toast.success('Clinic added to local view!');
      setShowAddClinicModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLostDogSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const backendUrl = import.meta.env.VITE_SERVER_DOMAIN || 'https://nsd-backend-api.vercel.app';
      const response = await fetch(`${backendUrl}/api/lost-dogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lostDogData)
      });

      if (response.ok) {
        const newDog = await response.json();
        setLostDogs(prev => [...prev, newDog]);
        toast.success('Lost dog report submitted!');
        setShowLostDogModal(false);
        setLostDogData({ name: '', description: '', breed: '', color: '', contact: '', dateLost: new Date().toISOString().split('T')[0], lat: '21.1458', lng: '79.0882' });
      } else {
        throw new Error();
      }
    } catch {
      // Mock insert on local state if offline
      const mockDog = {
        _id: 'mock-dog-' + Date.now(),
        name: lostDogData.name,
        description: lostDogData.description,
        breed: lostDogData.breed,
        color: lostDogData.color,
        contact: lostDogData.contact,
        dateLost: lostDogData.dateLost,
        lat: parseFloat(lostDogData.lat),
        lng: parseFloat(lostDogData.lng)
      };
      setLostDogs(prev => [...prev, mockDog]);
      toast.success('Lost dog report added to local view!');
      setShowLostDogModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerZoom = (direction) => {
    setZoomTrigger(direction);
    setTimeout(() => setZoomTrigger(null), 100);
  };

  // Filter elements
  const filteredMarkers = [
    ...(activeFilter === 'all' || activeFilter === 'vet'
      ? vetClinics.map(c => ({ ...c, markerType: 'vet', icon: vetIcon }))
      : []),
    ...(activeFilter === 'all' || activeFilter === 'lost'
      ? lostDogs.map(d => ({ ...d, markerType: 'lost', icon: lostDogIcon }))
      : [])
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF8EF]">
        <Loader2 className="w-12 h-12 animate-spin text-[#C1592A] mb-4" />
        <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Loading Map View...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EF] text-[#17251E] font-dm-sans selection:bg-[#C1592A]/20 pb-16">
      
      {/* 1. Header Hero Details */}
      <section className="pt-4 pb-8 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-left">
          <ScrollAnimate animation="fade-right">
            <span className="text-[#C1592A] text-xs font-bold uppercase tracking-widest block mb-4">
              • MAPS
            </span>
            <h1 className="text-4xl md:text-5xl font-manrope font-extrabold text-[#17251E] mb-4 leading-tight">
              Animal Rescue Map
            </h1>
            <p className="text-base text-[#3A362E]/90 leading-relaxed max-w-xl mb-6">
              Find nearby veterinary clinics and report lost dogs in your area.
            </p>
            
            {/* Current location pill */}
            <div className="inline-flex items-center gap-2.5 bg-white border border-[#E4DAC4] rounded-full px-5 py-2.5 shadow-sm text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Using your current location</span>
            </div>
          </ScrollAnimate>
        </div>
      </section>

      {/* 2. Filters and Legends block */}
      <section className="py-4 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Filter buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-3 rounded-full text-xs font-bold tracking-wide transition duration-200 border cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#C1592A] border-transparent text-[#FFF8EF]'
                : 'bg-white border-[#E4DAC4] text-gray-700 hover:bg-[#FFFDF6]'
            }`}
          >
            Show All
          </button>
          <button
            onClick={() => setActiveFilter('vet')}
            className={`px-6 py-3 rounded-full text-xs font-bold tracking-wide transition duration-200 border cursor-pointer ${
              activeFilter === 'vet'
                ? 'bg-[#C1592A] border-transparent text-[#FFF8EF]'
                : 'bg-white border-[#E4DAC4] text-gray-700 hover:bg-[#FFFDF6]'
            }`}
          >
            Vet Clinics
          </button>
          <button
            onClick={() => setActiveFilter('lost')}
            className={`px-6 py-3 rounded-full text-xs font-bold tracking-wide transition duration-200 border cursor-pointer ${
              activeFilter === 'lost'
                ? 'bg-[#C1592A] border-transparent text-[#FFF8EF]'
                : 'bg-white border-[#E4DAC4] text-gray-700 hover:bg-[#FFFDF6]'
            }`}
          >
            Lost Dogs
          </button>
        </div>

        {/* Legends */}
        <div className="flex items-center gap-6 text-xs font-bold text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#1B3B2E] border border-white"></span>
            <span>Veterinary Clinic</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#C1592A] border border-white"></span>
            <span>Lost Dog Reported</span>
          </div>
        </div>

      </section>

      {/* 3. The Map Canvas */}
      <section className="py-4 max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollAnimate animation="zoom-in">
          <div className="relative rounded-[2.5rem] border border-[#E4DAC4] overflow-hidden shadow-md bg-[#EDE6D3]/30 h-[550px] w-full z-10">
            
            <MapContainer
              center={userLocation || mapCenter}
              zoom={currentZoom}
              zoomControl={false}
              style={{ height: '100%', width: '100%', zIndex: 1 }}
            >
              <MapUpdater center={userLocation || mapCenter} zoom={currentZoom} />
              <MapZoomController zoomTrigger={zoomTrigger} />
              
              {/* Premium grey/beige minimal map tiles */}
              <TileLayer
                attribution='&copy; CartoDB Positron'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />

              {/* Render Pins */}
              {filteredMarkers.map((marker) => (
                <Marker 
                  key={marker._id} 
                  position={[marker.lat, marker.lng]} 
                  icon={marker.icon}
                >
                  <Popup closeButton={false}>
                    {marker.markerType === 'vet' ? (
                      <div className="p-3 text-left font-dm-sans min-w-[200px]">
                        <h4 className="font-manrope font-extrabold text-sm text-[#17251E] mb-1">{marker.name}</h4>
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-2">Veterinary Clinic</span>
                        <p className="text-xs text-[#3A362E] mb-1 leading-relaxed">📍 {marker.address}</p>
                        {marker.phone && <p className="text-xs text-[#3A362E] mb-1">📞 {marker.phone}</p>}
                        <p className="text-xs text-[#3A362E] mb-3">🕒 {marker.hours || 'Open 24 Hours'}</p>
                        {marker.phone && (
                          <a 
                            href={`tel:${marker.phone}`}
                            className="bg-[#C1592A] hover:bg-[#D97706] text-white px-4 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase inline-block text-center transition"
                          >
                            Call Clinic
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 text-left font-dm-sans min-w-[200px]">
                        <h4 className="font-manrope font-extrabold text-sm text-[#17251E] mb-1">Lost: {marker.name}</h4>
                        <span className="text-[10px] text-[#C1592A] uppercase font-bold tracking-wider block mb-2">Lost Dog Reported</span>
                        <p className="text-xs text-[#3A362E] mb-2 leading-relaxed">{marker.description}</p>
                        <p className="text-xs text-[#3A362E] mb-1">📅 Lost: {marker.dateLost}</p>
                        <p className="text-xs text-[#3A362E] mb-3">📞 Owner: {marker.contact}</p>
                        <a 
                          href={`tel:${marker.contact}`}
                          className="bg-[#C1592A] hover:bg-[#D97706] text-white px-4 py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase inline-block text-center transition"
                        >
                          Report Sighting
                        </a>
                      </div>
                    )}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Custom Vector Floating Zoom Controls on the right */}
            <div className="absolute right-6 top-6 flex flex-col gap-2 z-[999] bg-white border border-[#E4DAC4] rounded-2xl shadow p-1">
              <button 
                onClick={() => triggerZoom('in')}
                className="w-10 h-10 rounded-xl bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 transition cursor-pointer"
              >
                <Plus className="w-5 h-5" />
              </button>
              <div className="h-px bg-[#E4DAC4] mx-2" />
              <button 
                onClick={() => triggerZoom('out')}
                className="w-10 h-10 rounded-xl bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 transition cursor-pointer"
              >
                <Minus className="w-5 h-5" />
              </button>
            </div>

          </div>
        </ScrollAnimate>
      </section>

      {/* 4. Bottom Cards Grid */}
      <section className="py-8 max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 z-10 relative">
        
        {/* Card 1: Add Veterinary Clinic */}
        <ScrollAnimate animation="fade-right">
          <div className="bg-[#FFFDF6] p-8 md:p-10 rounded-[2.5rem] border border-[#E4DAC4] text-left shadow-sm flex flex-col justify-between h-full">
            <div>
              <h3 className="text-2xl font-manrope font-extrabold text-[#17251E] mb-3">Add Your Veterinary Clinic</h3>
              <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed mb-6">
                Add your clinic to help pet parents find quality care.
              </p>
            </div>
            <button
              onClick={() => setShowAddClinicModal(true)}
              className="bg-[#C1592A] hover:bg-[#D97706] text-[#FFF8EF] px-8 py-3.5 rounded-full font-dm-sans font-bold text-xs uppercase tracking-wider transition w-max cursor-pointer"
            >
              Add Clinic
            </button>
          </div>
        </ScrollAnimate>

        {/* Card 2: Report Lost Dog */}
        <ScrollAnimate animation="fade-left">
          <div className="bg-[#FFFDF6] p-8 md:p-10 rounded-[2.5rem] border border-[#E4DAC4] text-left shadow-sm flex flex-col justify-between h-full">
            <div>
              <h3 className="text-2xl font-manrope font-extrabold text-[#17251E] mb-3">Report a Lost Dog</h3>
              <p className="text-sm text-[#3A362E]/80 font-dm-sans leading-relaxed mb-6">
                Report a lost dog so our community can help.
              </p>
            </div>
            <button
              onClick={() => setShowLostDogModal(true)}
              className="bg-[#C1592A] hover:bg-[#D97706] text-[#FFF8EF] px-8 py-3.5 rounded-full font-dm-sans font-bold text-xs uppercase tracking-wider transition w-max cursor-pointer"
            >
              Report Lost Dog
            </button>
          </div>
        </ScrollAnimate>

      </section>

      {/* 5. Add Clinic Modal */}
      {showAddClinicModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
          <div className="bg-[#FFF8EF] text-[#17251E] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative border border-[#E4DAC4]" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowAddClinicModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-manrope font-extrabold text-left mb-6">Add Veterinary Clinic</h3>
            
            <form onSubmit={handleClinicSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-1.5">Clinic Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Care & Cure Clinic"
                  value={clinicData.name}
                  onChange={(e) => setClinicData({ ...clinicData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E4DAC4] bg-white rounded-xl placeholder-gray-400 focus:outline-none focus:border-[#17251E] transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-1.5">Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Sadar, Nagpur"
                  value={clinicData.address}
                  onChange={(e) => setClinicData({ ...clinicData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E4DAC4] bg-white rounded-xl placeholder-gray-400 focus:outline-none focus:border-[#17251E] transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 9967477018"
                  value={clinicData.phone}
                  onChange={(e) => setClinicData({ ...clinicData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E4DAC4] bg-white rounded-xl placeholder-gray-400 focus:outline-none focus:border-[#17251E] transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-1.5">Working Hours</label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM - 8:00 PM"
                  value={clinicData.hours}
                  onChange={(e) => setClinicData({ ...clinicData, hours: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E4DAC4] bg-white rounded-xl placeholder-gray-400 focus:outline-none focus:border-[#17251E] transition text-sm"
                />
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-1.5">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={clinicData.lat}
                    onChange={(e) => setClinicData({ ...clinicData, lat: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E4DAC4] bg-white rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-1.5">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={clinicData.lng}
                    onChange={(e) => setClinicData({ ...clinicData, lng: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E4DAC4] bg-white rounded-xl text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C1592A] hover:bg-[#D97706] text-white py-3.5 rounded-xl font-dm-sans font-bold text-sm tracking-wide transition shadow cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Clinic'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Report Lost Dog Modal */}
      {showLostDogModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 py-6 overflow-y-auto">
          <div className="bg-[#FFF8EF] text-[#17251E] rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative border border-[#E4DAC4]" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setShowLostDogModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-manrope font-extrabold text-left mb-6">Report Lost Dog</h3>
            
            <form onSubmit={handleLostDogSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-1.5">Dog's Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rocky"
                  value={lostDogData.name}
                  onChange={(e) => setLostDogData({ ...lostDogData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E4DAC4] bg-white rounded-xl placeholder-gray-400 focus:outline-none focus:border-[#17251E] transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-1.5">Description *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Breed, color, collar detail, last seen spot..."
                  value={lostDogData.description}
                  onChange={(e) => setLostDogData({ ...lostDogData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E4DAC4] bg-white rounded-xl placeholder-gray-400 focus:outline-none focus:border-[#17251E] transition text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-1.5">Breed</label>
                  <input
                    type="text"
                    placeholder="Indie"
                    value={lostDogData.breed}
                    onChange={(e) => setLostDogData({ ...lostDogData, breed: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E4DAC4] bg-white rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-1.5">Color</label>
                  <input
                    type="text"
                    placeholder="Brown/White"
                    value={lostDogData.color}
                    onChange={(e) => setLostDogData({ ...lostDogData, color: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E4DAC4] bg-white rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-1.5">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9967477018"
                    value={lostDogData.contact}
                    onChange={(e) => setLostDogData({ ...lostDogData, contact: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E4DAC4] bg-white rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-1.5">Date Lost *</label>
                  <input
                    type="date"
                    required
                    value={lostDogData.dateLost}
                    onChange={(e) => setLostDogData({ ...lostDogData, dateLost: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E4DAC4] bg-white rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-1.5">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={lostDogData.lat}
                    onChange={(e) => setLostDogData({ ...lostDogData, lat: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E4DAC4] bg-white rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#3A362E] mb-1.5">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={lostDogData.lng}
                    onChange={(e) => setLostDogData({ ...lostDogData, lng: e.target.value })}
                    className="w-full px-4 py-3 border border-[#E4DAC4] bg-white rounded-xl text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C1592A] hover:bg-[#D97706] text-white py-3.5 rounded-xl font-dm-sans font-bold text-sm tracking-wide transition shadow cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Report Lost Dog'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MapComponent;
