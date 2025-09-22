import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// User Management Service
export class UserService {
  // Create or update user profile
  static async createOrUpdateUser(userData) {
    try {
      const { email, name, profilePicture } = userData;
      
      // Use email as userId for simplicity
      const userId = email.replace(/[^a-zA-Z0-9]/g, '_');
      
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      const userProfile = {
        userId,
        email,
        name: name || 'Traveler',
        profilePicture: profilePicture || '',
        lastLoginAt: serverTimestamp(),
        ...(userDoc.exists() ? {} : {
          createdAt: serverTimestamp(),
          preferences: {
            defaultBudget: 5000,
            favoriteDestinations: [],
            travelStyle: 'comfort'
          }
        })
      };
      
      await setDoc(userRef, userProfile, { merge: true });
      return { userId, ...userProfile };
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  }

  // Get user profile
  static async getUserProfile(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Get user by email
  static async getUserByEmail(email) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  // Check if user can generate a new trip based on actual trip count
  static async canGenerateTrip(userId) {
    try {
      // 获取用户实际创建的旅行计划数量
      const trips = await TripService.getUserTrips(userId);
      const currentCount = trips.length;
      const maxAllowed = 10; // 固定限制为10次
      
      return {
        canGenerate: currentCount < maxAllowed,
        currentCount,
        maxAllowed,
        remaining: maxAllowed - currentCount
      };
    } catch (error) {
      console.error('Error checking trip generation limit:', error);
      return {
        canGenerate: true,
        currentCount: 0,
        maxAllowed: 10,
        remaining: 10
      };
    }
  }

}

// Trip Management Service
export class TripService {
  // Create a new trip
  static async createTrip(userId, tripData) {
    try {
      const tripsRef = collection(db, 'users', userId, 'trips');
      const tripDoc = doc(tripsRef);
      
      const trip = {
        tripId: tripDoc.id,
        userId,
        title: `${tripData.userPreference?.location || 'Trip'} - ${tripData.userPreference?.days || 0} days`,
        destination: tripData.userPreference?.location || '',
        userPreference: tripData.userPreference,
        tripDatas: tripData.tripDatas,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isPublic: false,
        status: 'active'
      };
      
      await setDoc(tripDoc, trip);
      return trip;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  }

  // Get user's trips
  static async getUserTrips(userId) {
    try {
      const tripsRef = collection(db, 'users', userId, 'trips');
      const q = query(tripsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const trips = [];
      querySnapshot.forEach((doc) => {
        trips.push({ id: doc.id, ...doc.data() });
      });
      
      return trips;
    } catch (error) {
      console.error('Error getting user trips:', error);
      throw error;
    }
  }

  // Get trip by ID
  static async getTripById(userId, tripId) {
    try {
      const tripRef = doc(db, 'users', userId, 'trips', tripId);
      const tripDoc = await getDoc(tripRef);
      
      if (tripDoc.exists()) {
        return { id: tripDoc.id, ...tripDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting trip by ID:', error);
      throw error;
    }
  }

  // Delete trip
  static async deleteTrip(userId, tripId) {
    try {
      const tripRef = doc(db, 'users', userId, 'trips', tripId);
      await deleteDoc(tripRef);
      return true;
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  }

  // Update trip
  static async updateTrip(userId, tripId, updateData) {
    try {
      const tripRef = doc(db, 'users', userId, 'trips', tripId);
      await updateDoc(tripRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  }
}

