import React, { createContext, useState, useContext, useEffect } from "react";

// Create the SearchContext
const SearchContext = createContext();

// Create a provider component
export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage on initialization
    return JSON.parse(localStorage.getItem("favorites")) || [];
  });
  const [attendees, setAttendees] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // This state will track the search query

  const setSearchData = (data) => {
    setSearchResults(data);  // Store search data in context
  };
  
  // Function to add an event to favorites
  const addFavorite = (event) => {
    setFavorites((prevFavorites) => {
      // Prevent duplicates
      if (prevFavorites.some((fav) => fav.id === event.id)) {
        return prevFavorites;
      }
      const updatedFavorites = [...prevFavorites, event];
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      console.log("Favorites saved to localStorage:", updatedFavorites); 
      return updatedFavorites;
    });
  };

  // Function to remove an event from favorites
  const removeFavorite = (eventId) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter((e) => e.id !== eventId);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  // Add attendees for an event
  const addAttendee = (eventId, attendeeName) => {
    const updatedAttendees = { ...attendees };
    if (!updatedAttendees[eventId]) {
      updatedAttendees[eventId] = [];
    }
    updatedAttendees[eventId].push(attendeeName);
    setAttendees(updatedAttendees);
  };

  // Function to handle search input change and update results
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  // Function to filter events based on the search term
  useEffect(() => {
    const filteredResults = searchTerm
      ? searchResults.filter(
          (event) =>
            event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : searchResults;
    setSearchResults(filteredResults);
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
