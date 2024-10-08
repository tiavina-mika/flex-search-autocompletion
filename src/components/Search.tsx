// components/Search.tsx
import { useState, useEffect, ChangeEvent, useCallback } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  addDataToIndex,
  searchIndex,
  suggestIndex,
} from "../utils/articleSearchIndex";
// import leven from "leven"; // For more accurate autocorrection
import { debounce } from "lodash";

// Define Article interface
export interface Article {
  id: number;
  title: string;
  content: string;
}

// Sample data to populate the index
const articles: Article[] = [
  {
    id: 1,
    // title: "How to Use poireaux",
    title: "How to Use FlexSearch",
    content: "A guide on using FlexSearch for document search.",
  },
  {
    id: 2,
    title: "Building Autocomplete",
    content: "Steps to implement autocomplete with FlexSearch.",
  },
  {
    id: 3,
    title: "React with FlexSearch",
    content: "Integrating FlexSearch into a React app.",
  },
];

const Search = () => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Article[]>([]);

   // Populate the FlexSearch index on component mount
  useEffect(() => {
    addDataToIndex(articles);
  }, []);


  // Debounced search handler
  const handleDebouncedSearch = useCallback(
    debounce(async (value: string) => {
      let searchResults = await searchIndex(value);


      if (searchResults.length <= 0) {
        searchResults = suggestIndex(value, articles);
      } else {
        searchResults = searchResults.map((r) => r.doc);
      }

      setSuggestions(searchResults);
    }, 500),
    []
  );

  // Handle search input changes
  const handleSearch = (_: ChangeEvent<{}>, value: string) => {
    setQuery(value);
    handleDebouncedSearch(value);
  };

  // return (
  //   <div>
  //     <input
  //       type="text"
  //       value={query}
  //       onChange={handleSearch}
  //       placeholder="Search documents with autocorrect..."
  //       style={{ width: "300px", padding: "8px" }}
  //     />
  //     <ul>
  //       {suggestions.map((suggestion, index) => (
  //         <li key={index}>{suggestion.title}</li>
  //       ))}
  //     </ul>
  //   </div>
  // );
  return (
    <Autocomplete
      freeSolo
      options={suggestions}
      filterOptions={(x) => x}
      getOptionLabel={(option: Article | string) => {
        return option === "string" ? option : (option as Article).title;
      }}
      inputValue={query}
      onInputChange={handleSearch}
      renderInput={(params) => (
        <TextField {...params} label="Search Articles" variant="outlined" />
      )}
    />
  );
};

export default Search;
