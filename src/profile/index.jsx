import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserService, TripService } from '../service/userService';
import { toast } from 'sonner';
import { 
  User, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Users, 
  Clock, 
  Star, 
  Trash2, 
  Eye, 
  Edit,
  Plus,
  Search,
  Filter,
  Heart,
  Globe,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Footer from '../view-trip/[tripId]/components/Footer';

function Profile() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTrips, setFilteredTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = async () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log('User data loaded:', parsedUser);
          
        // Create or update user in database
        const userEmail = parsedUser.email || parsedUser.user_email;
        if (userEmail) {
          const userProfile = await UserService.createOrUpdateUser({
            email: userEmail,
            name: parsedUser.name || 'Traveler',
            profilePicture: parsedUser.picture || ''
          });
          
          // 从数据库获取最新的用户信息
          const latestUserProfile = await UserService.getUserProfile(userProfile.userId);
          
          // 确保头像信息被正确设置
          const userWithPicture = {
            ...latestUserProfile,
            picture: parsedUser.picture || latestUserProfile.profilePicture || '',
            profilePicture: parsedUser.picture || latestUserProfile.profilePicture || ''
          };
          
          console.log('Latest user profile from database:', userWithPicture);
          setUser(userWithPicture);
          fetchUserTrips(userProfile.userId);
        } else {
          setUser(parsedUser);
          fetchUserTrips();
        }
        } catch (error) {
          console.error('Error initializing user:', error);
          localStorage.removeItem('user');
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };

    initializeUser();
  }, [navigate]);

  // 监听localStorage变化，实时更新用户状态
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
        navigate('/');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate]);

  useEffect(() => {
    // 搜索和筛选功能
    const filtered = trips.filter(trip => {
      const location = (trip.userPreference?.location || '').toString().toLowerCase();
      const search = searchTerm.toLowerCase();
      return location.includes(search);
    });
    setFilteredTrips(filtered);
  }, [trips, searchTerm]);

  const fetchUserTrips = async (userId = null) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!userId) {
        // Fallback to old method for backward compatibility
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
          setError('User not logged in, please login first');
          toast.error('User not logged in, please login first');
          navigate('/');
          return;
        }

        const userEmail = userData.email || userData.user_email;
        if (!userEmail) {
          setError('User information incomplete, please login again');
          toast.error('User information incomplete, please login again');
          navigate('/');
          return;
        }

        // Use old method as fallback
        await fetchUserTripsOld(userEmail);
        return;
      }

      console.log('Fetching trips for user ID:', userId);
      const tripsData = await TripService.getUserTrips(userId);
      console.log('Fetched trips:', tripsData);
      setTrips(tripsData);
    } catch (error) {
      console.error('Error fetching trips:', error);
      setError('Failed to fetch trips: ' + error.message);
      toast.error('Failed to fetch trips: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fallback method for old data structure
  const fetchUserTripsOld = async (userEmail) => {
    try {
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const { db } = await import('../service/firebaseConfig');
      
      const tripsRef = collection(db, 'AITrips');
      const q = query(tripsRef, where('userEmail', '==', userEmail));
      const querySnapshot = await getDocs(q);
      
      const tripsData = [];
      querySnapshot.forEach((doc) => {
        const tripData = doc.data();
        tripsData.push({
          id: doc.id,
          firestoreId: doc.id,
          docId: tripData.id,
          ...tripData
        });
      });
      
      tripsData.sort((a, b) => {
        const aId = parseInt(a.docId || a.id) || 0;
        const bId = parseInt(b.docId || b.id) || 0;
        return bId - aId;
      });
      
      setTrips(tripsData);
    } catch (error) {
      console.error('Error fetching trips (old method):', error);
      throw error;
    }
  };

  const deleteTrip = async (tripId) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        console.log('Deleting trip with ID:', tripId);
        
        if (user?.userId) {
          // Use new structure
          await TripService.deleteTrip(user.userId, tripId);
        } else {
          // Fallback to old structure
          const { deleteDoc, doc } = await import('firebase/firestore');
          const { db } = await import('../service/firebaseConfig');
          await deleteDoc(doc(db, 'AITrips', tripId));
        }
        
        setTrips(trips.filter(trip => trip.id !== tripId));
        toast.success('Trip deleted successfully');
        
        // 触发自定义事件通知Header更新限制信息
        if (user?.userId) {
          const { UserService } = await import('../service/userService');
          const updatedLimitCheck = await UserService.canGenerateTrip(user.userId);
          window.dispatchEvent(new CustomEvent('tripLimitUpdated', { 
            detail: { 
              userId: user.userId, 
              limitInfo: updatedLimitCheck 
            } 
          }));
        }
      } catch (error) {
        console.error('Error deleting trip:', error);
        toast.error('Delete failed: ' + error.message);
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTripStatus = (trip) => {
    const days = trip.userPreference?.days || 0;
    const budget = trip.userPreference?.budget || 0;
    const people = trip.userPreference?.people || 0;
    
    if (days >= 7) return { text: 'Long Trip', color: 'bg-purple-100 text-purple-800' };
    if (days >= 3) return { text: 'Short Trip', color: 'bg-blue-100 text-blue-800' };
    return { text: 'Day Trip', color: 'bg-green-100 text-green-800' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-6 py-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#153582] mx-auto mb-4"></div>
              <p className="text-[#576380]">Loading...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-16">
      
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-2xl md:text-4xl font-extrabold text-[#153582] mb-2 md:mb-4">
              My Travel Profile
            </h1>
            <p className="text-[#576380] text-sm md:text-lg">
              Manage your travel preferences and trip history
            </p>
          </div>

          {/* User Info Card */}
          <div className="nj-card simple-sticker mb-8">
            <div className="p-4 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex items-center space-x-4 md:space-x-6">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-[#153582] to-[#F48FB1] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    {user?.profilePicture ? (
                      <img 
                        src={`${user.profilePicture}?sz=200`} 
                        alt={user.name || 'Traveler'} 
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                        onLoad={() => console.log('Profile picture loaded successfully')}
                        onError={(e) => {
                          console.log('Profile picture failed to load:', user.profilePicture);
                          console.log('Trying fallback method...');
                          // 尝试移除跨域属性
                          e.target.crossOrigin = null;
                          e.target.referrerPolicy = null;
                          e.target.src = user.profilePicture;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
                      </div>
                    )}
                    <div className={`w-full h-full flex items-center justify-center ${user?.profilePicture ? 'hidden' : 'flex'}`}>
                      <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold text-[#153582] mb-1 md:mb-2 truncate">
                      {user?.name || 'Traveler'}
                    </h2>
                    <p className="text-[#576380] text-sm md:text-base mb-3 md:mb-4 truncate">{user?.email}</p>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 md:gap-4 text-xs md:text-sm">
                      <div className="flex items-center text-[#576380]">
                        <Globe className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
                        <span className="truncate">{trips.length} trips created</span>
                      </div>
                      <div className="flex items-center text-[#576380]">
                        <Heart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
                        <span className="truncate">Love exploring</span>
                      </div>
                      <div className="flex items-center text-[#576380]">
                        <Star className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
                        <span className="truncate">{trips.length} / 10 trips used</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-auto">
                  <Link
                    to="/create-trip"
                    className="nj-button-primary w-full md:w-auto"
                  >
                    <span className="nj-button-inner block px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
                      <Plus className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
                      Create New Trip
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="nj-card simple-sticker mb-8">
            <div className="p-4 md:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#576380] w-4 h-4 md:w-5 md:h-5" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#153582] focus:border-transparent text-sm md:text-base"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => fetchUserTrips(user?.userId)}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-4 py-2 md:py-3 bg-[#153582] text-white rounded-full hover:bg-[#283593] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                    <Filter className="w-4 h-4 text-[#576380]" />
                    <span className="text-[#576380] text-sm">
                      {filteredTrips.length} trips found
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="nj-card simple-sticker mb-8">
              <div className="p-6">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertCircle className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold">Load Failed</h3>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => fetchUserTrips(user?.userId)}
                    className="bg-red-100 text-red-600 px-4 py-2 rounded-full hover:bg-red-200 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Trip List */}
          <div className="space-y-6">
            {!error && filteredTrips.length === 0 ? (
              <div className="nj-card simple-sticker">
                <div className="p-6 md:p-12 text-center">
                  <MapPin className="w-12 h-12 md:w-16 md:h-16 text-[#576380] mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg md:text-xl font-semibold text-[#153582] mb-2">
                    {searchTerm ? 'No matching trips found' : 'No trips created yet'}
                  </h3>
                  <p className="text-[#576380] mb-6 text-sm md:text-base">
                    {searchTerm ? 'Try searching with different keywords' : 'Start creating your first travel plan!'}
                  </p>
                  {!searchTerm && (
                    <Link
                      to="/create-trip"
                      className="nj-button-primary"
                    >
                      <span className="nj-button-inner block px-6 md:px-8 py-2 md:py-3 text-sm md:text-base">
                        <Plus className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />
                        Create First Trip
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              filteredTrips.map((trip) => {
                const status = getTripStatus(trip);
                const itinerary = trip?.tripDatas?.tripDatas?.itinerary || trip?.tripDatas?.itinerary || [];
                const hotelOptions = trip?.tripDatas?.tripDatas?.hotelOptions || trip?.tripDatas?.hotelOptions || [];
                
                return (
                  <div key={trip.id} className="nj-card simple-sticker">
                    <div className="p-4 md:p-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                            <h3 className="text-lg md:text-xl font-bold text-[#153582] truncate">
                              {trip.userPreference?.location || '未知目的地'}
                            </h3>
                            <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${status.color} self-start`}>
                              {status.text}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm text-[#576380] mb-4">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{trip.userPreference?.days || 0} days</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                              <span className="truncate">${(trip.userPreference?.budget || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{trip.userPreference?.people || 0} people</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                              <span className="truncate">{formatDate(trip.id)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <Link
                            to={`/view-trip/${trip.id}`}
                            className="flex-1 bg-[#153582] text-white px-4 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-[#283593] transition-colors text-sm md:text-base"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Link>
                          <button
                            onClick={() => deleteTrip(trip.id)}
                            className="flex-1 bg-red-100 text-red-600 px-4 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-red-200 transition-colors text-sm md:text-base"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      {/* Trip Preview */}
                      <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <h4 className="font-semibold text-[#153582] mb-2 flex items-center text-sm md:text-base">
                              <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0" />
                              Trip Highlights
                            </h4>
                            <div className="space-y-1">
                              {itinerary.slice(0, 3).map((day, index) => (
                                <div key={index} className="text-xs md:text-sm text-[#576380]">
                                  Day {day.day}: {day.plan?.length || 0} attractions
                                </div>
                              ))}
                              {itinerary.length > 3 && (
                                <div className="text-xs md:text-sm text-[#F48FB1]">
                                  +{itinerary.length - 3} more days...
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-[#153582] mb-2 flex items-center text-sm md:text-base">
                              <Star className="w-3 h-3 md:w-4 md:h-4 mr-2 flex-shrink-0" />
                              Hotel Recommendations
                            </h4>
                            <div className="space-y-1">
                              {hotelOptions.slice(0, 2).map((hotel, index) => (
                                <div key={index} className="text-xs md:text-sm text-[#576380] truncate">
                                  {hotel.hotelName || `Hotel ${index + 1}`}
                                </div>
                              ))}
                              {hotelOptions.length > 2 && (
                                <div className="text-xs md:text-sm text-[#F48FB1]">
                                  +{hotelOptions.length - 2} more options...
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Profile;
