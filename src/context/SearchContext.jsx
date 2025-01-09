import React, { createContext, useState, useContext, useEffect } from "react";
import { collection, doc, getDocs, setDoc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext"; // Import the AuthContext for user data
import { db } from "../firebase"; // Firestore instance

// Create the SearchContext
const SearchContext = createContext();

// Create a provider component
export const SearchProvider = ({ children }) => {
  const { user } = useAuth(); // Get authenticated user
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [attendees, setAttendees] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // Track the search query

  // Fetch favorites from Firestore when the user logs in
  const fetchFavorites = async () => {
    if (user) {
      try {
        const favoritesRef = collection(db, `users/${user.uid}/favorites`);
        const snapshot = await getDocs(favoritesRef);
        const fetchedFavorites = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFavorites(fetchedFavorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    }
  };

  // Fetch attendees from Firestore when the user logs in
  const fetchAttendees = async () => {
    if (user) {
      try {
        const attendeesRef = collection(db, `users/${user.uid}/attendees`);
        const snapshot = await getDocs(attendeesRef);
        const fetchedAttendees = {};
        snapshot.docs.forEach((doc) => {
          fetchedAttendees[doc.id] = doc.data().attendees || [];
        });
        setAttendees(fetchedAttendees);
      } catch (error) {
        console.error("Error fetching attendees:", error);
      }
    }
  };

  // Sync data when the user logs in
  useEffect(() => {
    if (user) {
      fetchFavorites();
      fetchAttendees();
    }
  }, [user]);

  // Function to set search results
  const setSearchData = (data) => {
    setSearchResults(data);
  };

  // Add an event to favorites and sync with Firestore
  const addFavorite = async (event) => {
    if (!user) return;

    try {
      const favoriteRef = doc(db, `users/${user.uid}/favorites`, event.id);
      await setDoc(favoriteRef, event); // Save the event as a favorite
      setFavorites((prevFavorites) => [...prevFavorites, event]);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  // Remove an event from favorites and sync with Firestore
  const removeFavorite = async (eventId) => {
    if (!user) return;

    try {
      const favoriteRef = doc(db, `users/${user.uid}/favorites`, eventId);
      await deleteDoc(favoriteRef); // Remove the document
      setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== eventId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  // Add attendees for an event and sync with Firestore
  const addAttendee = async (eventId, attendeeName) => {
    if (!user) return;

    try {
      const attendeesRef = doc(db, `users/${user.uid}/attendees`, eventId);
      await updateDoc(attendeesRef, {
        attendees: arrayUnion(attendeeName),
      });
      setAttendees((prevAttendees) => ({
        ...prevAttendees,
        [eventId]: [...(prevAttendees[eventId] || []), attendeeName],
      }));
    } catch (error) {
      console.error("Error adding attendee:", error);
    }
  };

  // Function to handle search input change and update results
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  // Filter events based on the search term
  useEffect(() => {
    if (searchTerm) {
      const filteredResults = searchResults.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filteredResults);
    }
  }, [searchTerm, searchResults]);

  return (
    <SearchContext.Provider
      value={{
        searchResults,
        setSearchResults,
        setSearchData,
        favorites,
        addFavorite,
        removeFavorite,
        addAttendee,
        attendees,
        searchTerm,
        handleSearch, // Provide the search handler to be used in other components
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to access search context
export const useSearchContext = () => {
  return useContext(SearchContext);
};
