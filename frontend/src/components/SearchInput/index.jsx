import { useState } from "react";
import { FaSearch } from "react-icons/fa";

import "./index.css";

const SearchInput = ({ searchBooks }) => {
  const [searchInputValue, setSearchInputValue] = useState("");

  const onSubmitSearchInput = event => {
    event.preventDefault();
    searchBooks(searchInputValue);
  };

  return (
    <form className="input-container" onSubmit={onSubmitSearchInput}>
      <input
        type="text"
        value={searchInputValue}
        placeholder="Search here"
        className="search-input"
        onChange={e => setSearchInputValue(e.target.value)}
      />

      <button className="search-button" type="submit">
        <FaSearch className="search-icon" />
      </button>
    </form>
  );
};

export default SearchInput;
