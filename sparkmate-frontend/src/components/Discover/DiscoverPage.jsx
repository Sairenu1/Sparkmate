import { useState, useEffect } from 'react';
import { 
  Heart, X, Star, MessageCircle, User, Sparkles, MapPin, 
  Plane, Dumbbell, Camera, Music, Book, Palette, Dog, Pizza,
  Info, Shield, Zap, Settings, Coffee, Check, Bell, Filter,
  ArrowLeft, ChevronRight
} from 'lucide-react';

const DiscoverPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('discover');
  const [likedUsers, setLikedUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [superLikes, setSuperLikes] = useState(3);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [imageIndex, setImageIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  const [notifications, setNotifications] = useState(2);

  const users = [
    {
      id: 1,
      name: 'Emma',
      age: 24,
      location: 'New York',
      distance: '2 miles away',
      bio: 'Adventure seeker 🏔️ Coffee lover ☕ Yoga enthusiast 🧘 Looking for someone who can keep up with my energy!',
      interests: ['Travel', 'Yoga', 'Coffee', 'Photography'],
      tags: ['5\' 7" (170 cm)', 'Active', 'Don\'t smoke', 'Spiritual'],
      images: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
        'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&q=80'
      ],
      verified: true,
      job: 'UX Designer',
      education: 'NYU Graduate'
    },
    {
      id: 2,
      name: 'Sophie',
      age: 26,
      location: 'Brooklyn',
      distance: '3 miles away',
      bio: 'Foodie 🍕 Book lover 📚 Dog mom 🐕 Wine enthusiast seeking meaningful connections.',
      interests: ['Reading', 'Cooking', 'Dogs', 'Wine'],
      tags: ['5\' 5" (165 cm)', 'Relationship', 'Christian', 'Moderate'],
      images: [
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&q=80',
        'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?w=800&q=80'
      ],
      verified: false,
      job: 'Marketing Manager',
      education: 'Columbia University'
    },
    {
      id: 3,
      name: 'Olivia',
      age: 23,
      location: 'Manhattan',
      distance: '1 mile away',
      bio: 'Artist 🎨 Music festival junkie 🎵 Stargazer ✨ Creative soul looking for inspiration.',
      interests: ['Art', 'Music', 'Astronomy', 'Dancing'],
      tags: ['5\' 6" (168 cm)', 'Something casual', 'Atheist', 'Leo'],
      images: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
        'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=800&q=80'
      ],
      verified: true,
      job: 'Freelance Artist',
      education: 'Parsons School of Design'
    },
    {
      id: 4,
      name: 'Isabella',
      age: 25,
      location: 'Queens',
      distance: '4 miles away',
      bio: 'Fitness coach 💪 Beach lover 🏖️ Always up for brunch and good vibes.',
      interests: ['Fitness', 'Beach', 'Brunch', 'Travel'],
      tags: ['5\' 8" (173 cm)', 'Active', 'Don\'t drink', 'Virgo'],
      images: [
        'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=800&q=80',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80'
      ],
      verified: true,
      job: 'Personal Trainer',
      education: 'NASM Certified'
    },
    {
      id: 5,
      name: 'Ava',
      age: 27,
      location: 'Upper East Side',
      distance: '2 miles away',
      bio: 'Wine enthusiast 🍷 Travel blogger ✈️ Sunset chaser 🌅 Living life one adventure at a time.',
      interests: ['Wine', 'Travel', 'Photography', 'Writing'],
      tags: ['5\' 9" (175 cm)', 'Want someday', 'Spiritual', 'Never'],
      images: [
        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80',
        'https://images.unsplash.com/photo-1514315384763-ba401779410f?w=800&q=80'
      ],
      verified: false,
      job: 'Content Creator',
      education: 'Boston University'
    }
  ];

  const currentUser = users[currentIndex] || users[0];

  const interestIcons = {
    'Travel': Plane,
    'Yoga': Dumbbell,
    'Coffee': Coffee,
    'Reading': Book,
    'Cooking': Pizza,
    'Dogs': Dog,
    'Art': Palette,
    'Music': Music,
    'Photography': Camera,
    'Fitness': Dumbbell,
    'Wine': Coffee,
    'Dancing': Music,
    'Beach': Plane,
    'Brunch': Pizza,
    'Writing': Book,
    'Astronomy': Sparkles
  };

  const showToast = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const animateSwipe = (direction, callback) => {
    setSwipeDirection(direction);
    setIsAnimating(true);
    setTimeout(() => {
      callback();
      setSwipeDirection(null);
      setIsAnimating(false);
    }, 300);
  };

  const handleLike = () => {
    animateSwipe('right', () => {
      setLikedUsers([...likedUsers, currentUser]);
      showToast(`You liked ${currentUser.name}! 💕`);
      
      if (Math.random() < 0.3) {
        setMatches([...matches, currentUser]);
        setTimeout(() => showToast(`It's a match with ${currentUser.name}! 🎉`), 400);
      }
      
      nextProfile();
    });
  };

  const handlePass = () => {
    animateSwipe('left', () => {
      showToast(`Passed on ${currentUser.name}`);
      nextProfile();
    });
  };

  const handleSuperLike = () => {
    if (superLikes > 0) {
      animateSwipe('up', () => {
        setSuperLikes(superLikes - 1);
        setLikedUsers([...likedUsers, { ...currentUser, superLiked: true }]);
        
        if (Math.random() < 0.6) {
          setMatches([...matches, currentUser]);
          showToast(`It's a SUPER MATCH with ${currentUser.name}! 🌟`);
        } else {
          showToast(`Super Like sent to ${currentUser.name}! 💫`);
        }
        
        nextProfile();
      });
    } else {
      showToast('No Super Likes left! Get more in premium.');
    }
  };

  const nextProfile = () => {
    setImageIndex(0);
    setShowProfileDetails(false);
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const nextImage = () => {
    if (imageIndex < currentUser.images.length - 1) {
      setImageIndex(imageIndex + 1);
    }
  };

  const prevImage = () => {
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (activeTab === 'discover' && !isAnimating && !showSettings && !showFilters) {
        switch(e.key) {
          case 'ArrowLeft':
            handlePass();
            break;
          case 'ArrowRight':
            handleLike();
            break;
          case 'ArrowUp':
            handleSuperLike();
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, activeTab, isAnimating, showSettings, showFilters]);

  const getSwipeTransform = () => {
    if (!swipeDirection) return '';
    switch(swipeDirection) {
      case 'left':
        return 'translateX(-150%) rotate(-15deg)';
      case 'right':
        return 'translateX(150%) rotate(15deg)';
      case 'up':
        return 'translateY(-150%) scale(0.8)';
      default:
        return '';
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'discover':
        return (
          <div className="flex items-center justify-center min-h-[calc(100vh-180px)] px-4">
            <div className="w-full max-w-md">
              <div 
                className="relative bg-gray-800 rounded-[28px] overflow-hidden shadow-[0_0_60px_rgba(236,72,153,0.3),0_0_30px_rgba(239,68,68,0.2)]"
                style={{
                  transform: getSwipeTransform(),
                  opacity: swipeDirection ? 0 : 1,
                  transition: 'all 0.3s ease-out'
                }}
              >
                {/* Image Section */}
                <div className="relative h-[520px] overflow-hidden rounded-t-[28px]">
                  <img
                    src={currentUser.images[imageIndex]}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Progress Bars */}
                  <div className="absolute top-3 left-3 right-3 flex gap-1.5 z-10">
                    {currentUser.images.map((_, idx) => (
                      <div
                        key={idx}
                        className="h-1 flex-1 rounded-full bg-black/30 backdrop-blur-sm overflow-hidden"
                      >
                        <div 
                          className={`h-full bg-white transition-all duration-300 ${
                            idx === imageIndex ? 'w-full' : idx < imageIndex ? 'w-full' : 'w-0'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Image Navigation */}
                  <div className="absolute inset-0 flex">
                    <button 
                      onClick={prevImage}
                      className="flex-1 bg-transparent active:bg-black/10 transition-colors"
                      aria-label="Previous image"
                    />
                    <button 
                      onClick={nextImage}
                      className="flex-1 bg-transparent active:bg-black/10 transition-colors"
                      aria-label="Next image"
                    />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>
                  
                  {/* User Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-bold tracking-tight">
                          {currentUser.name}, {currentUser.age}
                        </h2>
                        {currentUser.verified && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check size={14} className="text-white" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => setShowProfileDetails(!showProfileDetails)}
                        className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                      >
                        <Info size={18} className="text-white" />
                      </button>
                    </div>
                    
                    <p className="text-sm font-medium text-white/90 mb-1">{currentUser.job}</p>
                    
                    <button className="flex items-center gap-1.5 text-white/90 text-sm mb-3 hover:text-white transition-colors">
                      <span className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Camera size={12} />
                      </span>
                      React to photo
                    </button>
                  </div>
                </div>

                {/* Info Section */}
                <div className="bg-gray-800 p-5">
                  <p className="text-white/90 text-sm leading-relaxed mb-4">
                    {currentUser.bio}
                  </p>
                  
                  {/* Location */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-700">
                    <div className="w-10 h-10 bg-gray-700/50 rounded-full flex items-center justify-center">
                      <MapPin size={18} className="text-white/70" />
                    </div>
                    <div>
                      <p className="text-white/90 text-sm font-medium">{currentUser.location}</p>
                      <p className="text-white/60 text-xs">{currentUser.distance}</p>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {currentUser.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gray-700/60 rounded-full text-xs text-white/90 font-medium border border-gray-600/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Interests */}
                  <div className="flex flex-wrap gap-2">
                    {currentUser.interests.map((interest, idx) => {
                      const Icon = interestIcons[interest];
                      return (
                        <span
                          key={idx}
                          className="px-3 py-2 bg-gray-700/60 rounded-full text-xs text-white/90 font-medium border border-gray-600/50 flex items-center gap-1.5"
                        >
                          {Icon && <Icon size={14} />}
                          {interest}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-center items-center gap-5 mt-6">
                <button
                  onClick={handlePass}
                  disabled={isAnimating}
                  className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] border-2 border-red-500/30 disabled:opacity-50"
                >
                  <X size={28} className="text-red-500" strokeWidth={2.5} />
                </button>

                <button
                  onClick={handleSuperLike}
                  disabled={isAnimating}
                  className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_rgba(59,130,246,0.7)] relative disabled:opacity-50"
                >
                  <Star size={24} className="text-white" fill="white" />
                  {superLikes > 0 && (
                    <span className="absolute -top-1 -right-1 bg-yellow-400 text-blue-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                      {superLikes}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleLike}
                  disabled={isAnimating}
                  className="w-16 h-16 bg-gradient-to-br from-pink-600 to-rose-600 rounded-full flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(236,72,153,0.6),0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_50px_rgba(236,72,153,0.8),0_0_30px_rgba(244,63,94,0.6)] disabled:opacity-50"
                >
                  <Heart size={28} className="text-white" fill="white" />
                </button>
              </div>
            </div>
          </div>
        );

      case 'likes':
        return (
          <div className="max-w-5xl mx-auto px-4 py-6">
            <h2 className="text-3xl font-bold text-white mb-8">People You've Liked</h2>
            {likedUsers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {likedUsers.map((user) => (
                  <div key={user.id} className="group cursor-pointer">
                    <div className="bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] transition-all duration-300 transform hover:scale-105 border border-gray-700">
                      <div className="aspect-[3/4] relative">
                        <img
                          src={user.images[0]}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                        {user.superLiked && (
                          <div className="absolute top-3 right-3 bg-blue-500 p-2 rounded-full shadow-lg">
                            <Star size={16} className="text-white" fill="white" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <p className="font-bold text-lg">{user.name}, {user.age}</p>
                          <p className="text-xs text-white/80 flex items-center gap-1">
                            <MapPin size={12} />
                            {user.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-600 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(236,72,153,0.5)]">
                  <Heart size={36} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No likes yet</h3>
                <p className="text-gray-400">Start swiping to find your perfect match!</p>
              </div>
            )}
          </div>
        );

      case 'matches':
        return (
          <div className="max-w-5xl mx-auto px-4 py-6">
            <h2 className="text-3xl font-bold text-white mb-8">Your Matches</h2>
            {matches.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {matches.map((user) => (
                  <div key={user.id} className="group cursor-pointer">
                    <div className="bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-[0_0_30px_rgba(147,51,234,0.4)] transition-all duration-300 transform hover:scale-105 border border-gray-700">
                      <div className="aspect-[3/4] relative">
                        <img
                          src={user.images[0]}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <p className="font-bold text-lg mb-3">{user.name}, {user.age}</p>
                          <button 
                            onClick={() => showToast(`Opening chat with ${user.name}...`)}
                            className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold py-2.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg"
                          >
                            <MessageCircle size={16} />
                            Send Message
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(147,51,234,0.5)]">
                  <MessageCircle size={36} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No matches yet</h3>
                <p className="text-gray-400">Keep swiping to find your connections!</p>
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="bg-gray-800 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.3)] p-8 border border-gray-700">
              <h2 className="text-3xl font-bold text-white mb-8">Your Profile</h2>
              
              <div className="flex items-center gap-6 mb-10">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-600 to-rose-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.5)]">
                  <User size={40} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">John Doe</h3>
                  <p className="text-gray-400 font-medium">john.doe@example.com</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    setShowSettings(true);
                    showToast('Settings opened');
                  }}
                  className="bg-gray-700/50 hover:bg-gray-700 rounded-2xl p-6 text-left transition-all border border-gray-600"
                >
                  <Settings className="text-gray-300 mb-3" size={28} />
                  <p className="text-white font-bold text-lg mb-1">Settings</p>
                  <p className="text-gray-400 text-sm">Manage preferences</p>
                </button>
                
                <button 
                  onClick={() => showToast('Verification process started!')}
                  className="bg-gray-700/50 hover:bg-gray-700 rounded-2xl p-6 text-left transition-all border border-gray-600"
                >
                  <Shield className="text-blue-400 mb-3" size={28} />
                  <p className="text-white font-bold text-lg mb-1">Get Verified</p>
                  <p className="text-gray-400 text-sm">Increase trust</p>
                </button>
                
                <button 
                  onClick={() => showToast('Premium features coming soon! 🌟')}
                  className="bg-gradient-to-br from-yellow-600/20 to-amber-600/20 hover:from-yellow-600/30 hover:to-amber-600/30 rounded-2xl p-6 text-left transition-all border border-yellow-600/50"
                >
                  <Zap className="text-yellow-400 mb-3" size={28} />
                  <p className="text-white font-bold text-lg mb-1">Go Premium</p>
                  <p className="text-gray-400 text-sm">Unlimited swipes</p>
                </button>
                
                <button 
                  onClick={() => showToast('Profile boosted for 30 minutes! 🚀')}
                  className="bg-gradient-to-br from-pink-600/20 to-rose-600/20 hover:from-pink-600/30 hover:to-rose-600/30 rounded-2xl p-6 text-left transition-all border border-pink-600/50"
                >
                  <Sparkles className="text-pink-400 mb-3" size={28} />
                  <p className="text-white font-bold text-lg mb-1">Boost Profile</p>
                  <p className="text-gray-400 text-sm">Get more views</p>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <button 
                  onClick={() => showToast('Signed out successfully')}
                  className="text-red-400 hover:text-red-300 font-semibold transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden">


      {/* Main Content */}
      <main className="pb-24">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around items-center py-3">
            <button
              onClick={() => setActiveTab('discover')}
              className={`flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl transition-all ${
                activeTab === 'discover'
                  ? 'text-pink-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Sparkles size={24} strokeWidth={2.5} />
              <span className="text-xs font-bold">Discover</span>
            </button>
            
            <button
              onClick={() => setActiveTab('likes')}
              className={`flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl transition-all relative ${
                activeTab === 'likes'
                  ? 'text-pink-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Heart size={24} strokeWidth={2.5} />
              <span className="text-xs font-bold">Likes</span>
              {likedUsers.length > 0 && (
                <span className="absolute -top-1 right-3 bg-gradient-to-br from-pink-600 to-rose-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.6)]">
                  {likedUsers.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('matches')}
              className={`flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl transition-all relative ${
                activeTab === 'matches'
                  ? 'text-pink-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <MessageCircle size={24} strokeWidth={2.5} />
              <span className="text-xs font-bold">Matches</span>
              {matches.length > 0 && (
                <span className="absolute -top-1 right-3 bg-gradient-to-br from-purple-600 to-pink-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.6)]">
                  {matches.length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-1.5 px-6 py-2 rounded-2xl transition-all ${
                activeTab === 'profile'
                  ? 'text-pink-500'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <User size={24} strokeWidth={2.5} />
              <span className="text-xs font-bold">Profile</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-gray-800 rounded-3xl p-6 max-w-md w-full border border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                <span className="text-white font-medium">Notifications</span>
                <button className="w-12 h-6 bg-pink-600 rounded-full relative">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                <span className="text-white font-medium">Show Distance</span>
                <button className="w-12 h-6 bg-pink-600 rounded-full relative">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl border border-gray-600">
                <span className="text-white font-medium">Show Age</span>
                <button className="w-12 h-6 bg-pink-600 rounded-full relative">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                </button>
              </div>
              
              <button 
                onClick={() => {
                  showToast('Distance range updated');
                  setShowSettings(false);
                }}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowFilters(false)}>
          <div className="bg-gray-800 rounded-3xl p-6 max-w-md w-full border border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-white font-medium mb-2 block">Distance (miles)</label>
                <input type="range" min="1" max="100" defaultValue="50" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>1 mi</span>
                  <span>100 mi</span>
                </div>
              </div>
              
              <div>
                <label className="text-white font-medium mb-2 block">Age Range</label>
                <div className="flex gap-4">
                  <input type="number" placeholder="Min" defaultValue="18" className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-xl border border-gray-600" />
                  <input type="number" placeholder="Max" defaultValue="35" className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-xl border border-gray-600" />
                </div>
              </div>
              
              <button 
                onClick={() => {
                  showToast('Filters applied successfully');
                  setShowFilters(false);
                }}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Details Modal */}
      {showProfileDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end" onClick={() => setShowProfileDetails(false)}>
          <div className="bg-gray-800 rounded-t-3xl p-6 w-full max-h-[80vh] overflow-y-auto border-t border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">{currentUser.name}'s Profile</h3>
              <button onClick={() => setShowProfileDetails(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-2">About</h4>
                <p className="text-gray-300">{currentUser.bio}</p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Details</h4>
                <div className="space-y-2">
                  <p className="text-gray-300"><span className="text-gray-400">Job:</span> {currentUser.job}</p>
                  <p className="text-gray-300"><span className="text-gray-400">Education:</span> {currentUser.education}</p>
                  <p className="text-gray-300"><span className="text-gray-400">Location:</span> {currentUser.location}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {currentUser.interests.map((interest, idx) => {
                    const Icon = interestIcons[interest];
                    return (
                      <span
                        key={idx}
                        className="px-3 py-2 bg-gray-700/60 rounded-full text-xs text-white/90 font-medium border border-gray-600/50 flex items-center gap-1.5"
                      >
                        {Icon && <Icon size={14} />}
                        {interest}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-[slideDown_0.3s_ease-out]">
          <div className="bg-gray-800 text-white px-6 py-3.5 rounded-full shadow-[0_0_40px_rgba(236,72,153,0.5)] flex items-center gap-2.5 border border-pink-500/30">
            <Sparkles className="text-pink-400" size={18} />
            <span className="font-semibold">{notificationMessage}</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default DiscoverPage;