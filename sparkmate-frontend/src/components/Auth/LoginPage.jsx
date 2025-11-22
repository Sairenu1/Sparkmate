import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Heart } from 'lucide-react';

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

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in (only after checking user exists)
  useEffect(() => {
    // Small delay to ensure page renders first
    const timer = setTimeout(() => {
      if (user) {
        navigate('/discover', { replace: true });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Redirect to discover page
        setTimeout(() => {
          navigate('/discover', { replace: true });
        }, 500);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500 animate-gradient-shift">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.1),transparent)]"></div>
      </div>
      
      <FallingHearts />
      
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-100/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 transform transition-all duration-500 hover:shadow-pink-500/30">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-pink-500 to-purple-600 rounded-full p-5 shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Heart size={40} fill="currentColor" color="currentColor" className="animate-bounce text-gray-100" style={{ animationDuration: '2s' }} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            SparkMate
          </h1>
          <p className="text-center text-gray-600 mb-8 text-sm md:text-base">
            Find your perfect match ✨
          </p>

          {/* Form */}
          <div className="space-y-5">
            {/* Email Input */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-pink-500 focus-within:bg-gray-100 transition-all duration-300">
                <Mail className="absolute left-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3.5 bg-transparent outline-none text-gray-700 placeholder-gray-400 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative flex items-center bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-pink-500 focus-within:bg-gray-100 transition-all duration-300">
                <Lock className="absolute left-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3.5 bg-transparent outline-none text-gray-700 placeholder-gray-400 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !email || !password}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-gray-100 font-semibold py-4 rounded-xl shadow-lg hover:shadow-pink-500/50 transform hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
            >
              <span className="relative z-10">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
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

          {/* Sign Up Link */}
          <div className="text-center text-gray-600 text-sm md:text-base">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/signup')}
              className="text-pink-600 font-semibold hover:text-purple-600 transition-colors duration-300 hover:underline"
            >
              Create one
            </button>
          </div>
        </div>

        {/* Bottom Decorative Elements */}
        <div className="mt-8 text-center text-gray-100/80 text-xs md:text-sm">
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

export default LoginPage;