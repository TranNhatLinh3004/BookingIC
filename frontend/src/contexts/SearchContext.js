import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();
const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (newValue) => {
    setSearchTerm(newValue);
  };
  const value = {
    searchTerm,
    handleSearch,
  };
  return (
    <SearchContext.Provider value={value}> {children} </SearchContext.Provider>
  );
};

// export const useSearch = () => {
//   return useContext(SearchContext);
// };
export { SearchContext, SearchProvider };
