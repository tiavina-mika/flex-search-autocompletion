import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { createFilterOptions } from '@mui/material/Autocomplete';
import FlexSearch from 'flexsearch';

const SearchAutocomplete = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Initialize FlexSearch instance
  const flexSearch = new FlexSearch();

  // Add your data to FlexSearch index
  // Replace this with your own data source
  flexSearch.add([
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Orange' },
    // Add more data items here
  ]);

  // Autocomplete filter options
  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => option.name,
  });

  // Handle search term change
  const handleSearchTermChange = (event, value) => {
    setSearchTerm(value);
    search(value);
  };

  // Perform search
  const search = (value) => {
    const results = flexSearch.search(value);
    setSearchResults(results);
  };

  return (
    <Autocomplete
      value={searchTerm}
      onChange={handleSearchTermChange}
      options={searchResults}
      getOptionLabel={(option) => option.name}
      filterOptions={filterOptions}
      renderInput={(params) => (
        <TextField {...params} label="Search" variant="outlined" />
      )}
    />
  );
};

export default SearchAutocomplete;