import { createContext, useContext, useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, getDocs } from "firebase/firestore"; // Firestore imports
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = getAuth();
  const db = getFirestore(); // Initialize Firestore
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const navigate = useNavigate();

  // Fetch user data (including username) after login
  const fetchUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUser({
          uid,
          email: userSnap.data().email,
          username: userSnap.data().username,
        });
      } else {
        console.error("No user data found!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(error.message || "Failed to fetch user data.");
    }
  };

  // Register a new user
  const register = async (email, password, username) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      // Save user data to Firestore
      const userRef = doc(db, "users", uid); // Firestore document reference
      await setDoc(userRef, {
        username, // Include the username
        email,
        events: {}, // Initialize empty events or any other user-specific fields
      });

      // Update user state with username
      setUser({ uid, email, username });

      toast.success("User registered successfully!");
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error(error.message || "Failed to register user.");
    }
  };

  // Login an existing user
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      // Fetch user data after login (including username)
      await fetchUserData(uid);

      toast.success("Logged in successfully!");
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(error.message || "Failed to log in.");
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out.");
    }
  };

  // Save an event for the current user
  const saveEvent = async (eventData) => {
    try {
      if (!user) throw new Error("User not authenticated!");

      // Dynamically create structure: users/{uid}/events/{eventId}
      const eventsRef = collection(db, `users/${user.uid}/events`);
      await addDoc(eventsRef, eventData); // Add event document dynamically
      toast.success("Event saved successfully!");
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error(error.message || "Failed to save event.");
    }
  };

  // Fetch all events for the current user
  const fetchUserEvents = async () => {
    try {
      if (!user) throw new Error("User not authenticated!");

      // Reference to the user's events collection
      const eventsRef = collection(db, `users/${user.uid}/events`);
      const snapshot = await getDocs(eventsRef);

      // Map snapshot data to an array of event objects
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return events;
    } catch (error) {
      console.error("Error fetching user events:", error);
      toast.error(error.message || "Failed to fetch events.");
    }
  };

  // Fetch user data on initial load if a user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        await fetchUserData(currentUser.uid); // Fetch user data on login
      } else {
        setUser(null); // Reset user if not logged in
      }
      setLoading(false); // Set loading state to false after auth check
    });

    return unsubscribe; // Cleanup on component unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, saveEvent, fetchUserEvents }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

