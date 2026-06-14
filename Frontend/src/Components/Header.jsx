import React, { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authentication/Authentication.jsx'; 
import logo from "../assets/nsdlogo.jpg"; // Update with your actual logo path
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

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

  return (
    <header className="glass-navbar px-6 py-4 flex items-center justify-between relative sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/">
          <img
            src={logo} // Or replace with your actual logo path
            alt="Logo"
            className="h-12 w-12 rounded-full"
          />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8 text-lg font-semibold text-black">
        <Link to="/about" className="hover:text-orange-500">About Us</Link>
        <Link to="/donate" className="hover:text-orange-500">Donate</Link>
        <Link to="/adopt" className="hover:text-orange-500">Adoption</Link>
        <Link to="/community" className="hover:text-orange-500">Blogs</Link>
        <Link to="/volunteer" className="hover:text-orange-500">Volunteer</Link>
        <Link to="/maps" className="hover:text-orange-500">Maps</Link>
        <Link to="/founder" className="hover:text-orange-500">Founder</Link>
        <Link to="/ourTeam" className="hover:text-orange-500">Our Team</Link>
        <a href="https://wooferzz.com/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">Shop</a>
      </nav>

      {/* Shop Button + User Avatar + Hamburger */}
      <div className="flex items-center space-x-4">
        <a
          href="https://whatsapp.com/channel/0029VatlZaQ2P59rLcuPt90o"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white px-5 py-2 rounded-full font-bold hover:bg-green-700 transition"
        >
          WhatsApp
        </a>
        
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
        <div className="absolute top-full left-0 w-full glass-solid md:hidden z-50 px-6 py-4 space-y-4 font-medium text-black">
          <Link to="/about" className="block hover:text-orange-500" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link to="/donate" className="block hover:text-orange-500" onClick={() => setMenuOpen(false)}>Donate</Link>
          <Link to="/adopt" className="block hover:text-orange-500" onClick={() => setMenuOpen(false)}>Adoption</Link>
          <Link to="/community" className="block hover:text-orange-500" onClick={() => setMenuOpen(false)}>Blogs</Link>
          <Link to="/volunteer" className="block hover:text-orange-500" onClick={() => setMenuOpen(false)}>Volunteer</Link>
          <Link to="/maps" className="block hover:text-orange-500" onClick={() => setMenuOpen(false)}>Maps</Link>
          <Link to="/founder" className="block hover:text-orange-500" onClick={() => setMenuOpen(false)}>Founder</Link>
          <Link to="/ourTeam" className="block hover:text-orange-500" onClick={() => setMenuOpen(false)}>Our Team</Link>
          <a href="https://wooferzz.com/" target="_blank" rel="noopener noreferrer" className="block hover:text-orange-500" onClick={() => setMenuOpen(false)}>Shop</a>
          
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