import React from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import FadeInWrapper from "../Animation/FadeinWrapper.jsx"
import { useAuth } from '../Authentication/Authentication';
function Signin() {
  const {login}=useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { email, password } = formData;
      if (!email || !password) {
        toast.error("All fields are required");
        return;
      }
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/user/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      login(data.token);
      toast.success("User signed in successfully");
      navigate("/");
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Sign in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <FadeInWrapper>
      <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden bg-pattern-doodles z-10 w-full font-['Outfit']">
        
        {/* Form container */}
        <div className="relative z-20 bg-white max-w-[420px] w-full px-8 py-10 rounded-[32px] shadow-xl border border-orange-100/50 transition-all duration-500">
          
          {/* Header with orange accent */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#FF7A00] rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold text-[#FF5500] mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-500 font-medium text-sm">Every paw deserves a helping hand 🐾</p>
          </div>

          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="w-full px-5 py-3.5 pl-12 bg-white border border-gray-300 rounded-full text-gray-800 placeholder-gray-400/80 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all font-medium text-sm"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => { setFormData({ ...formData, email: e.target.value }) }}
                />
                <svg className="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  className="w-full px-5 py-3.5 pl-12 bg-white border border-gray-300 rounded-full text-gray-800 placeholder-gray-400/80 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all font-medium text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => { setFormData({ ...formData, password: e.target.value }) }}
                />
                <svg className="absolute left-4 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center text-sm">
              <a href="#" className="text-[#FF5500] hover:text-[#E15519] font-bold transition-colors duration-300">
                Forgot your password?
              </a>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-10 py-3.5 bg-[#FFA05E] hover:bg-[#E15519] text-white font-bold rounded-full shadow-md transition-all duration-300 disabled:opacity-50 flex items-center justify-center min-w-[140px]"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : 'Sign In'}
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="relative flex items-center justify-center my-6">
              <div className="w-full border-t border-gray-200"></div>
              <span className="absolute px-3 py-0.5 text-[10px] uppercase font-bold text-gray-400 bg-white border border-gray-200 rounded-full">or</span>
            </div>
            
            <div className="mt-6">
              <p className="text-gray-500 font-medium text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#FF5500] hover:text-[#E15519] font-bold hover:underline transition-colors duration-300">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Custom styles */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out;
          }
          
          .bg-pattern-doodles {
            background-color: #FFF9F2;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260' viewBox='0 0 260 260'%3E%3Cg stroke='%23EADDCB' stroke-width='1.5' fill='none' fill-rule='evenodd' stroke-linecap='round' stroke-linejoin='round'%3E%3Cg transform='translate(30%2C 40) rotate(-15 15 15)'%3E%3Cpath d='M15%2C26 C10%2C26 6%2C22 6%2C17 C6%2C12 10%2C8 15%2C8 C20%2C8 24%2C12 24%2C17 C24%2C22 20%2C26 15%2C26 Z'/%3E%3Ccircle cx='7' cy='8' r='3'/%3E%3Ccircle cx='12' cy='4' r='3'/%3E%3Ccircle cx='18' cy='4' r='3'/%3E%3Ccircle cx='23' cy='8' r='3'/%3E%3C/g%3E%3Cg transform='translate(140%2C 30) rotate(35 25 15)'%3E%3Cpath d='M15%2C10 L35%2C10 C37%2C7 42%2C7 44%2C10 C46%2C13 43%2C16 40%2C15 L40%2C17 C43%2C16 46%2C19 44%2C22 C42%2C25 37%2C25 35%2C22 L15%2C22 C13%2C25 8%2C25 6%2C22 C4%2C19 7%2C16 10%2C17 L10%2C15 C7%2C16 4%2C13 6%2C10 C8%2C7 13%2C7 15%2C10 Z'/%3E%3C/g%3E%3Cg transform='translate(60%2C 140) rotate(-10 20 15)'%3E%3Cpath d='M5%2C20 L35%2C20 C38%2C20 39%2C22 37%2C25 L33%2C32 C32%2C34 29%2C35 27%2C35 L13%2C35 C11%2C35 8%2C34 7%2C32 L3%2C25 C1%2C22 2%2C20 5%2C20 Z'/%3E%3Cellipse cx='20' cy='20' rx='15' ry='3.5'/%3E%3C/g%3E%3Cg transform='translate(180%2C 140) rotate(20 20 20)'%3E%3Ccircle cx='20' cy='20' r='14'/%3E%3Cpath d='M9%2C12 C14%2C17 26%2C17 31%2C12'/%3E%3Cpath d='M9%2C28 C14%2C23 26%2C23 31%2C28'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            background-repeat: repeat;
            background-size: 260px 260px;
          }
        `}</style>
      </div>
    </FadeInWrapper>
  );
}

export default Signin;
