import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Authentication/Authentication.jsx'; 
import logo from "../assets/nsdlogo.jpg"; // Update with your actual logo path

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleUserClick = () => {
    if (isAuthenticated()) {
      setUserMenuOpen(!userMenuOpen);
    } else {
      navigate('/signin');
    }
  };

  const handleProfileClick = () => {
    if (user && user._id) {
      navigate(`/${user._id}`);
    }
    setUserMenuOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    setUserMenuOpen(false);
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `transition-colors duration-200 ${
      isActive 
        ? 'text-nsd-orange font-extrabold' 
        : 'text-nsd-green-dark hover:text-nsd-orange font-bold'
    }`;
  };

  return (
    <header className="h-20 bg-nsd-beige-light px-8 flex items-center justify-between relative sticky top-0 z-50">
      {/* Logo & Brand Name */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center space-x-3 group">
          <img
            src={logo}
            alt="Nagpur Street Dogs Logo"
            className="h-12 w-12 rounded-full border border-nsd-beige-dark transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-manrope font-extrabold text-lg text-nsd-green-dark tracking-tight transition-colors duration-300 group-hover:text-nsd-orange">
            Nagpur Street Dogs
          </span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8 font-dm-sans text-sm text-nsd-green-dark">
        <Link to="/" className={getLinkClass('/')}>Home</Link>
        <Link to="/about" className={getLinkClass('/about')}>About Us</Link>
        <Link to="/donate#donate-card" className={getLinkClass('/donate')}>Donate</Link>
        <Link to="/adopt" className={getLinkClass('/adopt')}>Adopt</Link>
        <Link to="/volunteer" className={getLinkClass('/volunteer')}>Volunteer</Link>
        <Link to="/maps" className={getLinkClass('/maps')}>Maps</Link>
        <Link to="/founder" className={getLinkClass('/founder')}>Founder</Link>
        <a href="https://wooferzz.com/" target="_blank" rel="noopener noreferrer" className="hover:text-nsd-orange transition-colors duration-200 font-bold">Shop</a>
      </nav>
 
      {/* Primary Donate CTA + User Avatar + Hamburger */}
      <div className="flex items-center space-x-4 relative z-20">
        <Link
          to="/donate#donate-card"
          className="bg-nsd-orange text-nsd-beige-light px-6 py-2.5 rounded-full font-dm-sans font-bold text-sm tracking-wide hover:bg-nsd-orange-amber transition duration-200 shadow-sm"
        >
          Donate
        </Link>
        
        {/* User Avatar/Login Button */}
        <div className="relative">
          <button
            onClick={handleUserClick}
            className="focus:outline-none"
          >
            {isAuthenticated() && user ? (
              <div className="flex items-center space-x-2">
                {user.avatar && user.avatar !== '/default-avatar.png' ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    className="h-10 w-10 rounded-full object-cover border-2 border-amber-700"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`h-10 w-10 rounded-full border-2 border-amber-700 bg-gray-200 flex items-center justify-center ${
                    user.avatar && user.avatar !== '/default-avatar.png' ? 'hidden' : 'flex'
                  }`}
                >
                  <User size={24} className="text-gray-600" />
                </div>
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full border-2 border-amber-700 bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition">
                <User size={24} className="text-gray-600" />
              </div>
            )}
          </button>

          {/* User Dropdown Menu */}
          {userMenuOpen && isAuthenticated() && (
            <div className="absolute right-0 mt-2 w-48 glass-solid py-1 z-50 border">
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                <div className="font-medium">{user.name}</div>
                <div className="text-gray-500">{user.email}</div>
              </div>
              <button
                onClick={handleProfileClick}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                View Profile
              </button>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-nsd-beige-light md:hidden z-50 px-6 py-6 space-y-4 font-dm-sans text-sm text-nsd-green-dark shadow-lg border-t border-nsd-beige-dark">
          <Link to="/" className={`block ${getLinkClass('/')}`} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" className={`block ${getLinkClass('/about')}`} onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link to="/donate#donate-card" className={`block ${getLinkClass('/donate')}`} onClick={() => setMenuOpen(false)}>Donate</Link>
          <Link to="/adopt" className={`block ${getLinkClass('/adopt')}`} onClick={() => setMenuOpen(false)}>Adopt</Link>
          <Link to="/volunteer" className={`block ${getLinkClass('/volunteer')}`} onClick={() => setMenuOpen(false)}>Volunteer</Link>
          <Link to="/maps" className={`block ${getLinkClass('/maps')}`} onClick={() => setMenuOpen(false)}>Maps</Link>
          <Link to="/founder" className={`block ${getLinkClass('/founder')}`} onClick={() => setMenuOpen(false)}>Founder</Link>
          <a href="https://wooferzz.com/" target="_blank" rel="noopener noreferrer" className="block hover:text-nsd-orange transition-colors font-bold" onClick={() => setMenuOpen(false)}>Shop</a>
          
          {/* Mobile User Section */}
          {isAuthenticated() ? (
            <div className="border-t pt-4">
              <div className="flex items-center space-x-3 mb-3">
                {user.avatar && user.avatar !== '/default-avatar.png' ? (
                  <img
                    src={user.avatar}
                    alt={user.name || 'User'}
                    className="h-8 w-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className={`h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ${
                    user.avatar && user.avatar !== '/default-avatar.png' ? 'hidden' : 'flex'
                  }`}
                >
                  <User size={20} className="text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-gray-500 text-xs">{user.email}</div>
                </div>
              </div>
              <button
                onClick={handleProfileClick}
                className="block w-full text-left py-2 text-sm hover:text-blue-600"
              >
                View Profile
              </button>
              <button
                onClick={handleSignOut}
                className="block w-full text-left py-2 text-sm hover:text-blue-600"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="border-t pt-4">
              <Link
                to="/signin"
                className="block hover:text-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close menus */}
      {(userMenuOpen || menuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setUserMenuOpen(false);
            setMenuOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;