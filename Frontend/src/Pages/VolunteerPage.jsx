import React, { useState } from 'react';
import { Heart, Users, Globe, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import ScrollAnimate from '../Animation/ScrollAnimate';

function VolunteerPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

   const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.name.trim()) {
        alert('Please enter your full name');
        return;
    }

    if (!formData.email.trim()) {
        alert('Please enter your email address');
        return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        alert('Please enter a valid email address');
        return;
    }

    if (!formData.phone.trim()) {
        alert('Please enter your phone number');
        return;
    } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
        alert('Please enter a valid phone number (10-15 digits)');
        return;
    }

    if (!formData.address.trim()) {
        alert('Please enter your address');
        return;
    }

    if (!formData.city.trim()) {
        alert('Please enter your city');
        return;
    }

    if (!formData.state.trim()) {
        alert('Please enter your state');
        return;
    }

    if (!formData.country.trim()) {
        alert('Please enter your country');
        return;
    }

    if (!formData.pincode.trim()) {
        alert('Please enter your pincode');
        return;
    } else if (!/^[0-9]{4,10}$/.test(formData.pincode)) {
        alert('Please enter a valid pincode (4-10 digits)');
        return;
    }

    try {
        // Prepare form data to send
        const formDataToSend = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            country: formData.country.trim(),
            pincode: formData.pincode.trim()
        };

        const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/volunteer/createVolunteer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataToSend),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        // Reset form on successful submission
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            country: '',
            pincode: ''
        });

        toast.success('Registration successful! Thank you for volunteering.');

    } catch (error) {
        console.error('Registration error:', error);
        toast.error(error.message || 'An error occurred during registration. Please try again.');
    }
};
    const volunteerPhotos = [
        "/New photo/IMG-20250604-WA0090.jpg",
        "/New photo/IMG-20250604-WA0133.jpg",
        "/New photo/IMG-20250603-WA0050~2.jpg",
        "/New photo/IMG-20250604-WA0079.jpg",
        "/New photo/IMG-20250604-WA0148.jpg",
        "/New photo/IMG-20250604-WA0093.jpg",
        "/New photo/IMG-20250604-WA0140.jpg",
        "/New photo/IMG-20250604-WA0088.jpg",
        "/New photo/IMG-20250604-WA0101.jpg",
        "/New photo/IMG-20241206-WA0109~2.jpg",
        "/New photo/IMG-20250316-WA0019.jpg",
        "/New photo/IMG-20250604-WA0139.jpg",
        "/New photo/IMG-20250604-WA0097.jpg"
        
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            {/* Hero Section with Background Image */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-10 pb-10">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/New photo/IMG-20250604-WA0043.jpg"
                        alt="Volunteers helping community"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-900/50 to-amber-900/50"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 animate-bounce">
                    <div className="w-4 h-4 bg-amber-400 rounded-full opacity-60"></div>
                </div>
                <div className="absolute top-40 right-20 animate-pulse">
                    <div className="w-6 h-6 bg-orange-300 rounded-full opacity-40"></div>
                </div>
                <div className="absolute bottom-40 left-20 animate-bounce delay-1000">
                    <Sparkles className="w-8 h-8 text-amber-300 opacity-50" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border border-white/30">
                            <Heart className="w-5 h-5 text-white mr-2 fill-current" />
                            <span className="text-white font-medium">Join 10,000+ Active Volunteers</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
                            <span className="block">Make a</span>
                            <span className="block bg-gradient-to-r from-amber-300 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                                Difference
                            </span>
                            <span className="block">Today</span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-amber-100 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                            Join our community of passionate volunteers and help us build a better world together. 
                            Every moment you give creates ripples of positive change.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
                            <a href="#volunteer-form" className="group bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 py-5 rounded-2xl text-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-amber-500/25 transform hover:scale-105 hover:-translate-y-1">
                                <span className="flex items-center justify-center">
                                    Get Started Now
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </a>
                            <button className="group backdrop-blur-sm bg-white/20 border-2 border-white/40 text-white px-10 py-5 rounded-2xl text-xl font-semibold hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
                                <span className="flex items-center justify-center">
                                    Watch Our Story
                                    <div className="ml-3 w-3 h-3 bg-white rounded-full animate-pulse"></div>
                                </span>
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
                                <div className="text-3xl font-bold text-white mb-2">10,000+</div>
                                <div className="text-amber-200">Active Volunteers</div>
                            </div>
                            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
                                <div className="text-3xl font-bold text-white mb-2">50,000+</div>
                                <div className="text-amber-200">Lives Impacted</div>
                            </div>
                            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
                                <div className="text-3xl font-bold text-white mb-2">100+</div>
                                <div className="text-amber-200">Communities Served</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-24 relative overflow-hidden" id="volunteer-form">
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-amber-50"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-200/30 to-transparent rounded-full blur-3xl"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Left Column - Enhanced Info */}
                        <ScrollAnimate animation="fade-right">
                        <div className="space-y-10 lg:sticky lg:top-32">
                            <div className="space-y-6">
                                <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-amber-100 rounded-full px-6 py-2.5 shadow-sm">
                                    <span className="text-orange-600 font-semibold text-sm tracking-wide">🐾 JOIN OUR PACK</span>
                                </div>
                                
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                                    Every Paw Needs a
                                    <span className="block text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text">
                                        Helping Hand
                                    </span>
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Be part of Nagpur's biggest street dog welfare movement. 
                                    Your time and compassion can save lives.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div className="group flex items-start space-x-5 p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-orange-100 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300">
                                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-200/50">
                                        <Heart className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">Rescue & Rehabilitate</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Help rescue injured and abandoned dogs from the streets. Your hands can heal wounded paws.
                                        </p>
                                    </div>
                                </div>

                                <div className="group flex items-start space-x-5 p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-orange-100 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300">
                                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-200/50">
                                        <Users className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">Community Drives</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Join feeding drives, water pot distributions, and radium belt campaigns across Nagpur.
                                        </p>
                                    </div>
                                </div>

                                <div className="group flex items-start space-x-5 p-5 rounded-2xl bg-white/80 backdrop-blur-sm border border-orange-100 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300">
                                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-200/50">
                                        <Globe className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">Spread Awareness</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            Educate others about animal welfare and build a kinder, more compassionate Nagpur.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </ScrollAnimate>

                        {/* Right Column - Enhanced Form */}
                        <ScrollAnimate animation="fade-left" delay={200}>
                        <div className="relative">
                            <div className="absolute -top-6 -left-6 w-72 h-72 bg-gradient-to-br from-orange-200 to-amber-200 rounded-full opacity-20 blur-3xl"></div>
                            <div className="absolute -bottom-6 -right-6 w-56 h-56 bg-gradient-to-tl from-orange-300 to-amber-100 rounded-full opacity-15 blur-3xl"></div>
                            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl shadow-orange-100/50 border border-orange-100/50">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-orange-300/40 rotate-3 hover:rotate-0 transition-transform duration-300">
                                        <Sparkles className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Become a Volunteer</h3>
                                    <p className="text-gray-500">Join 150+ passionate dog lovers making a difference</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Full Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none"
                                            placeholder="Enter your full name" required />
                                    </div>

                                    {/* Email & Phone in 2 columns */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                                            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange}
                                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none"
                                                placeholder="your@email.com" required />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange}
                                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none"
                                                placeholder="+91 9876543210" required />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1.5">Street Address</label>
                                        <textarea id="address" name="address" value={formData.address} onChange={handleInputChange} rows={2}
                                            className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none resize-none"
                                            placeholder="House No., Street, Area" required></textarea>
                                    </div>

                                    {/* City & State in 2 columns */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                                            <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange}
                                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none"
                                                placeholder="Your city" required />
                                        </div>
                                        <div>
                                            <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-1.5">State</label>
                                            <input type="text" id="state" name="state" value={formData.state} onChange={handleInputChange}
                                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none"
                                                placeholder="Your state" required />
                                        </div>
                                    </div>

                                    {/* Country & Pincode in 2 columns */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-1.5">Country</label>
                                            <input type="text" id="country" name="country" value={formData.country} onChange={handleInputChange}
                                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none"
                                                placeholder="Your country" required />
                                        </div>
                                        <div>
                                            <label htmlFor="pincode" className="block text-sm font-semibold text-gray-700 mb-1.5">Pincode</label>
                                            <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={handleInputChange}
                                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 outline-none"
                                                placeholder="Zip code" required />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button type="submit"
                                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-xl shadow-orange-200/50 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2">
                                        <Heart className="w-5 h-5" />
                                        Submit Application
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </form>

                                <p className="text-center text-sm text-gray-400 mt-4">
                                    We'll get back to you within 24 hours 💌
                                </p>
                            </div>
                        </div>
                        </ScrollAnimate>
                    </div>
                </div>
            </section>

            {/* Enhanced Photo Gallery Section */}
            <section className="py-24 bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full opacity-10 blur-2xl"></div>
                    <div className="absolute bottom-20 right-10 w-40 h-40 bg-amber-200 rounded-full opacity-10 blur-2xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <ScrollAnimate animation="fade-up">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center bg-white rounded-full px-6 py-2 mb-6 shadow-lg">
                            <span className="text-orange-600 font-semibold">📸 GALLERY</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Memories That
                            <span className="block text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text">
                                Matter
                            </span>
                        </h2>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                            Capturing the joy and impact our volunteers create through shared moments of kindness and community
                        </p>
                    </div>
                    </ScrollAnimate>

                    {/* Enhanced Photo Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Large featured photo */}
                        <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700">
                            <img
                                src={volunteerPhotos[0]}
                                alt="Featured volunteer moment"
                                className="w-full h-full min-h-[150px] object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                                <h3 className="text-3xl font-bold text-white mb-3">Making Impact Together</h3>
                                <p className="text-amber-200 text-lg">Community service event in Mumbai</p>
                            </div>
                        </div>

                        {/* Medium photos */}
                        {volunteerPhotos.slice(1, 5).map((photo, index) => (
                            <div key={index} className="relative group overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
                                <img
                                    src={photo}
                                    alt={`Volunteer moment ${index + 1}`}
                                    className="w-full h-70 object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                                    <Heart className="w-10 h-10 text-white fill-current" />
                                </div>
                            </div>
                        ))}

                        {/* Small photos */}
                        {volunteerPhotos.slice(5, 13).map((photo, index) => (
                            <div key={index} className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500">
                                <img
                                    src={photo}
                                    alt={`Volunteer moment ${index + 4}`}
                                    className="w-full h-50 object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-orange-600/80 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <span className="text-white font-semibold text-center px-4">Making Impact Together</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            {/* <footer className="bg-gradient-to-br from-orange-900 to-amber-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        <div className="md:col-span-2">
                            <h3 className="text-3xl font-bold mb-6">Volunteer Connect</h3>
                            <p className="text-orange-100 mb-6 text-lg leading-relaxed">
                                We connect passionate volunteers with meaningful opportunities to create positive change in communities around the world.
                            </p>
                            <div className="flex space-x-4">
                                <a href="https://www.facebook.com/nagpurstreetdogs" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-orange-800 rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors">
                                    <span className="sr-only">Facebook</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="https://www.instagram.com/nagpur_street_dogs?igsh=MXdubWFuN2F6Z3ppeA==" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-orange-800 rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors">
                                    <span className="sr-only">Instagram</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="https://x.com/nagpur_street_dogs" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-orange-800 rounded-full flex items-center justify-center hover:bg-orange-700 transition-colors">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
                            <ul className="space-y-3">
                                <li><a href="/" className="text-orange-100 hover:text-white transition-colors">Home</a></li>
                                <li><a href="/about" className="text-orange-100 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#volunteer-form" className="text-orange-100 hover:text-white transition-colors">Volunteer</a></li>
                                <li><a href="/community" className="text-orange-100 hover:text-white transition-colors">Events</a></li>
                                <li><a href="/founder" className="text-orange-100 hover:text-white transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold mb-6">Contact Us</h4>
                            <address className="not-italic text-orange-100">
                                <p className="mb-3">123 Volunteer Street</p>
                                <p className="mb-3">Mumbai, MH 400001</p>
                                <p className="mb-3">India</p>
                                <p className="mb-3">Email: info@volunteerconnect.org</p>
                                <p>Phone: +91 9876543210</p>
                            </address>
                        </div>
                    </div>
                    <div className="border-t border-orange-800 mt-12 pt-8 text-center text-orange-300">
                        <p>© {new Date().getFullYear()} Volunteer Connect. All rights reserved.</p>
                    </div>
                </div>
            </footer> */}
        </div>
    );
}

export default VolunteerPage;
