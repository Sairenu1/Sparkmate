import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, Heart, User } from 'lucide-react';

// Falling Hearts Component
const FallingHearts = () => {
  const hearts = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 4,
    size: 10 + Math.random() * 20
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute animate-fall opacity-30"
          style={{
            left: heart.left,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            top: '-50px'
          }}
        >
          <Heart 
            size={heart.size} 
            fill="rgba(255, 105, 180, 0.6)" 
            color="rgba(255, 105, 180, 0.8)" 
          />
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
    </div>
  );
};

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      // Prepare request body - EXACTLY matching backend SignupRequest
      const requestBody = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      console.log('Sending signup request:', requestBody);

      // Make API call
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.success) {
        toast.success('Account created successfully! 💕');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        toast.error(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Unable to connect to server. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 animate-gradient-shift">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
      </div>
      
      <FallingHearts />
      
      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 transform transition-all duration-500 hover:shadow-pink-500/30">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-pink-500 to-purple-600 rounded-full p-5 shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Heart size={40} fill="white" color="white" className="animate-bounce" style={{ animationDuration: '2s' }} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Join SparkMate
          </h1>
          <p className="text-center text-gray-600 mb-8 text-sm md:text-base">
            Start your love story today ✨
          </p>

          {/* Form */}
          <div className="space-y-4">
            {/* Name Input */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-pink-500 focus-within:bg-white transition-all duration-300">
                <User className="absolute left-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3.5 bg-transparent outline-none text-gray-700 placeholder-gray-400 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-pink-500 focus-within:bg-white transition-all duration-300">
                <Mail className="absolute left-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3.5 bg-transparent outline-none text-gray-700 placeholder-gray-400 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-pink-500 focus-within:bg-white transition-all duration-300">
                <Lock className="absolute left-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password (min 8 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3.5 bg-transparent outline-none text-gray-700 placeholder-gray-400 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-pink-500 focus-within:bg-white transition-all duration-300">
                <Lock className="absolute left-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3.5 bg-transparent outline-none text-gray-700 placeholder-gray-400 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-pink-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group mt-6"
            >
              <span className="relative z-10">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="px-4 text-gray-400 text-sm font-medium">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* Login Link */}
          <div className="text-center text-gray-600 text-sm md:text-base">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-pink-600 font-semibold hover:text-purple-600 transition-colors duration-300 hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>

        {/* Bottom Decorative Elements */}
        <div className="mt-8 text-center text-white/80 text-xs md:text-sm">
          <p>💕 Where hearts connect and love begins 💕</p>
        </div>
      </div>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default SignUpPage;