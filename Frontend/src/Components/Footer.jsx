import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-nsd-beige-light text-nsd-green-dark pt-16 pb-8 border-t border-nsd-beige-dark/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Logo & Description */}
          <div className="md:col-span-6 flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-nsd-green-dark text-nsd-beige-light flex items-center justify-center font-manrope font-extrabold text-lg">
                N
              </div>
              <span className="font-manrope font-extrabold text-lg text-nsd-green-dark tracking-tight">
                Nagpur Street Dogs
              </span>
            </div>
            <p className="text-nsd-charcoal-medium/80 font-dm-sans text-sm max-w-sm leading-relaxed">
              A community-driven initiative rescuing, treating and rehoming stray dogs across Nagpur.
            </p>
          </div>

          {/* Navigate Section */}
          <div className="md:col-span-3">
            <h4 className="font-manrope font-bold text-xs uppercase tracking-widest text-nsd-orange mb-4">NAVIGATE</h4>
            <ul className="space-y-2 font-dm-sans text-sm text-nsd-charcoal-medium/95">
              <li><Link to="/about" className="hover:text-nsd-orange transition">About</Link></li>
              <li><Link to="/volunteer" className="hover:text-nsd-orange transition">Our Work</Link></li>
              <li><Link to="/adopt" className="hover:text-nsd-orange transition">Adopt</Link></li>
              <li><Link to="/donate" className="hover:text-nsd-orange transition">Get Involved</Link></li>
              <li><a href="https://wooferzz.com/" target="_blank" rel="noopener noreferrer" className="hover:text-nsd-orange transition">Shop</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="md:col-span-3">
            <h4 className="font-manrope font-bold text-xs uppercase tracking-widest text-nsd-orange mb-4">CONTACT</h4>
            <ul className="space-y-2 font-dm-sans text-sm text-nsd-charcoal-medium/95">
              <li>Nagpur, Maharashtra, India</li>
              <li><a href="mailto:hello@nagpurstreetdogs.org" className="hover:text-nsd-orange transition">hello@nagpurstreetdogs.org</a></li>
              <li className="flex space-x-4 pt-2">
                <a href="https://www.instagram.com/nagpur_street_dogs?igsh=MXdubWFuN2F6Z3ppeA==" target="_blank" rel="noopener noreferrer" className="hover:text-nsd-orange transition font-bold">Instagram</a>
                <a href="https://whatsapp.com/channel/0029VatlZaQ2P59rLcuPt90o" target="_blank" rel="noopener noreferrer" className="hover:text-nsd-orange transition font-bold">Facebook</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="border-t border-nsd-beige-dark/30 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-nsd-charcoal-medium/60 font-dm-sans">
          <p>© {new Date().getFullYear()} Nagpur Street Dogs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;