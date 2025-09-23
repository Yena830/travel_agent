import React, { useState, useEffect } from "react";
import "@fontsource/black-ops-one";
import { useGoogleLogin } from "@react-oauth/google";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut, Star } from "lucide-react";
import axios from "axios";
import { UserService } from "../../service/userService";

function Header() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [tripLimit, setTripLimit] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // 加载用户的旅行限制信息
  const loadTripLimit = async () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        const userEmail = parsedUser.email || parsedUser.user_email;
        
        if (userEmail) {
          const userProfile = await UserService.createOrUpdateUser({
            email: userEmail,
            name: parsedUser.name || 'Traveler',
            profilePicture: parsedUser.picture || ''
          });
          
          const limitCheck = await UserService.canGenerateTrip(userProfile.userId);
          setTripLimit(limitCheck);
        }
      } catch (error) {
        console.error('Error loading trip limit:', error);
      }
    }
  };

  // 当用户登录时加载限制信息
  useEffect(() => {
    if (user) {
      loadTripLimit();
    }
  }, [user]);

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 监听旅行限制更新事件
  useEffect(() => {
    const handleTripLimitUpdate = (event) => {
      const { userId, limitInfo } = event.detail;
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const userEmail = parsedUser.email || parsedUser.user_email;
        if (userEmail) {
          const currentUserId = userEmail.replace(/[^a-zA-Z0-9]/g, '_');
          if (currentUserId === userId) {
            setTripLimit(limitInfo);
            console.log('Header: Trip limit updated via event:', limitInfo);
          }
        }
      }
    };

    window.addEventListener('tripLimitUpdated', handleTripLimitUpdate);
    return () => window.removeEventListener('tripLimitUpdated', handleTripLimitUpdate);
  }, []);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Login success!', tokenResponse);
      try {
        // Get user profile information
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        
        console.log('User Profile Data:', userInfo.data);
        
        // Save complete user data
        const completeUserData = {
          ...userInfo.data,
          access_token: tokenResponse.access_token,
          token_type: tokenResponse.token_type,
          expires_in: tokenResponse.expires_in
        };
        
        localStorage.setItem('user', JSON.stringify(completeUserData));
        setUser(completeUserData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to token data if profile fetch fails
        localStorage.setItem('user', JSON.stringify(tokenResponse));
        setUser(tokenResponse);
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    // 退出登录后自动跳转到首页
    navigate('/');
  };

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.relative')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);
  // 判断是否在主页
  const isHomePage = location.pathname === '/';
  
  // 根据页面和滚动状态决定背景样式
  const getHeaderStyles = () => {
    if (isHomePage && !isScrolled) {
      // 主页顶部：透明背景
      return 'bg-transparent';
    } else if (isHomePage && isScrolled) {
      // 主页滚动后：渐变背景 + 边框
      return 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-200';
    } else {
      // 其他页面：始终渐变背景
      return 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50';
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${getHeaderStyles()}`}>
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo Area */}
        <Link to="/" className="flex items-center space-x-2 group hover:opacity-80 transition-opacity duration-200">
          <img
            src="/logo.png"
            alt="Smart Trip Logo"
            className="w-6 h-6"
          />
          <div>
            <h1 className="text-xl font-normal text-[#153582] group-hover:text-[#283593] transition-colors duration-200" style={{fontFamily: 'Kranky, serif', lineHeight: '0.9', letterSpacing: '-0.02em'}}>
              Smart Trip
            </h1>
          </div>
        </Link>


        

        {/* User Menu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 bg-white rounded-full px-3 py-1.5 shadow-md hover:shadow-lg transition-all duration-300"
            >
              {user.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name || 'User'} 
                  className="w-7 h-7 rounded-full object-cover"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    console.log('Header avatar failed to load:', user.picture);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-7 h-7 rounded-full bg-[#153582] flex items-center justify-center ${user.picture ? 'hidden' : 'flex'}`}>
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-[#153582] font-medium text-sm">
                {user.name || 'User'}
              </span>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm text-gray-600">{user.email}</p>
                  {/* Trip Limit Display */}
                  {tripLimit && (
                    <div className="mt-2 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-[#153582]" />
                          <span className="text-xs text-[#576380]">Trips</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-[#153582]">
                            {tripLimit.remaining}/{tripLimit.maxAllowed}
                          </div>
                          <div className="text-xs text-[#576380]">remaining</div>
                        </div>
                      </div>
                      {tripLimit.remaining <= 3 && tripLimit.remaining > 0 && (
                        <div className="mt-1 text-xs text-yellow-600">
                          ⚠️ Running low
                        </div>
                      )}
                      {tripLimit.remaining === 0 && (
                        <div className="mt-1 text-xs text-red-600">
                          🚫 Limit reached
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <Link
                  to="/create-trip"
                  className="flex items-center px-4 py-2 text-[#153582] hover:bg-gray-50 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Trip
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-[#153582] hover:bg-gray-50 transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  <User className="w-4 h-4 mr-3" />
                  My Profile
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => login()}
            className="bg-gradient-to-r from-[#153582] to-[#283593] text-white hover:from-[#283593] hover:to-[#1A237E] px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Sign In
          </button>
        )}
      </div>

      {/* Simple decorative dots */}
      <div className="simple-doodle top-2 right-1/4 text-sm pink-accent">✨</div>
    </header>
  );
}

export default Header;

