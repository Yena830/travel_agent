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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';

function Profile() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
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
  };

  const handleConfirmDelete = () => {
    if (tripToDelete) {
      deleteTrip(tripToDelete.id);
      setShowDeleteDialog(false);
      setTripToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setTripToDelete(null);
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
              <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-8">
                <div className="flex items-center space-x-4 lg:space-x-6">
                  <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-r from-[#153582] to-[#F48FB1] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
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
                        <User className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
                      </div>
                    )}
                    <div className={`w-full h-full flex items-center justify-center ${user?.profilePicture ? 'hidden' : 'flex'}`}>
                      <User className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl lg:text-3xl font-bold text-[#153582] mb-2 lg:mb-3 truncate">
                      {user?.name || 'Traveler'}
                    </h2>
                    <p className="text-[#576380] text-sm lg:text-lg mb-4 lg:mb-6 truncate">{user?.email}</p>
                    <div className="flex flex-wrap gap-3 lg:gap-6 text-sm lg:text-base">
                      <div className="flex items-center text-[#576380]">
                        <Globe className="w-4 h-4 lg:w-5 lg:h-5 mr-2 flex-shrink-0" />
                        <span className="truncate">{trips.length} trips created</span>
                      </div>
                      <div className="flex items-center text-[#576380]">
                        <Heart className="w-4 h-4 lg:w-5 lg:h-5 mr-2 flex-shrink-0" />
                        <span className="truncate">Love exploring</span>
                      </div>
                      <div className="flex items-center text-[#576380]">
                        <Star className="w-4 h-4 lg:w-5 lg:h-5 mr-2 flex-shrink-0" />
                        <span className="truncate">{trips.length} / 10 trips used</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-auto lg:flex-shrink-0">
                  <Link
                    to="/create-trip"
                    className="nj-button-primary w-full lg:w-auto"
                  >
                    <span className="nj-button-inner block px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg">
                      <Plus className="w-5 h-5 lg:w-6 lg:h-6 inline mr-2" />
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
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#576380] w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 lg:py-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#153582] focus:border-transparent text-base lg:text-lg"
                  />
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-row items-stretch sm:items-center lg:items-center gap-3 lg:gap-4">
                  <button
                    onClick={() => fetchUserTrips(user?.userId)}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-3 lg:py-4 bg-[#153582] text-white rounded-full hover:bg-[#283593] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base lg:text-lg font-medium"
                  >
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  <div className="flex items-center justify-center gap-2 px-6 py-3 lg:py-4 bg-gray-50 rounded-full">
                    <Filter className="w-5 h-5 text-[#576380]" />
                    <span className="text-[#576380] text-base lg:text-lg font-medium">
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
                    <div className="p-4 md:p-6 lg:p-8">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-6">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4">
                            <h3 className="text-lg lg:text-2xl font-bold text-[#153582] truncate">
                              {trip.userPreference?.location || '未知目的地'}
                            </h3>
                            <span className={`px-3 lg:px-4 py-1 lg:py-2 rounded-full text-xs lg:text-sm font-semibold ${status.color} self-start`}>
                              {status.text}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 text-sm lg:text-base text-[#576380] mb-6">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 lg:w-5 lg:h-5 mr-2 flex-shrink-0" />
                              <span className="truncate">{trip.userPreference?.days || 0} days</span>
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 lg:w-5 lg:h-5 mr-2 flex-shrink-0" />
                              <span className="truncate">${(trip.userPreference?.budget || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 lg:w-5 lg:h-5 mr-2 flex-shrink-0" />
                              <span className="truncate">{trip.userPreference?.people || 0} people</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 lg:w-5 lg:h-5 mr-2 flex-shrink-0" />
                              <span className="truncate">{formatDate(trip.id)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-stretch gap-2 lg:gap-2 mb-4">
                          <Link
                            to={`/view-trip/${trip.id}`}
                            className="flex-1 lg:flex-none bg-[#153582] text-white px-4 lg:px-6 py-1.5 lg:py-2 rounded-full flex items-center justify-center gap-1.5 hover:bg-[#283593] transition-colors text-sm lg:text-base font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </Link>
                          <button
                            onClick={() => {
                              setTripToDelete(trip);
                              setShowDeleteDialog(true);
                            }}
                            className="flex-1 lg:flex-none bg-red-100 text-red-600 px-4 lg:px-6 py-1.5 lg:py-2 rounded-full flex items-center justify-center gap-1.5 hover:bg-red-200 transition-colors text-sm lg:text-base font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      {/* Trip Preview */}
                      <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                          <div>
                            <h4 className="font-semibold text-[#153582] mb-3 flex items-center text-base lg:text-lg">
                              <MapPin className="w-4 h-4 lg:w-5 lg:h-5 mr-2 flex-shrink-0" />
                              Trip Highlights
                            </h4>
                            <div className="space-y-2">
                              {itinerary.slice(0, 3).map((day, index) => (
                                <div key={index} className="text-sm lg:text-base text-[#576380]">
                                  Day {day.day}: {day.plan?.length || 0} attractions
                                </div>
                              ))}
                              {itinerary.length > 3 && (
                                <div className="text-sm lg:text-base text-[#F48FB1] font-medium">
                                  +{itinerary.length - 3} more days...
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-[#153582] mb-3 flex items-center text-base lg:text-lg">
                              <Star className="w-4 h-4 lg:w-5 lg:h-5 mr-2 flex-shrink-0" />
                              Hotel Recommendations
                            </h4>
                            <div className="space-y-2">
                              {hotelOptions.slice(0, 2).map((hotel, index) => (
                                <div key={index} className="text-sm lg:text-base text-[#576380] truncate">
                                  {hotel.hotelName || `Hotel ${index + 1}`}
                                </div>
                              ))}
                              {hotelOptions.length > 2 && (
                                <div className="text-sm lg:text-base text-[#F48FB1] font-medium">
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#153582] flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-500" />
              Delete Trip
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Are you sure you want to delete this trip? This action cannot be undone.
              {tripToDelete && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-[#153582]">
                    {tripToDelete.userPreference?.location || 'Unknown Destination'}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {tripToDelete.userPreference?.days || 0} days • ${(tripToDelete.userPreference?.budget || 0).toLocaleString()}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 mt-6">
            <button
              onClick={handleCancelDelete}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Delete Trip
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default Profile;
