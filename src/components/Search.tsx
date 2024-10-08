import { useState, useEffect, ChangeEvent, useCallback } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import {
  addDataToIndex,
  searchIndex,
  suggestIndex,
} from "../utils/articleSearchIndex";
import leven from "leven"; // For more accurate autocorrection
import { debounce } from "lodash";

export interface Article {
  id: number;
  title: string;
  content: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: "How to Use poireaux",
    // title: "How to Use FlexSearch",
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

const t1 = "How to Use poireaux";
console.log(
  "t1: ",
  leven("poreaux", t1),
  " - ",
  t1.length,
  "=",
  t1.length - leven("poreaux", t1)
);

const t2 = `
How to Use poireaux xx ffff Integrating
FlexSearch into a React app
`;
console.log(
  "t2: ",
  leven("poreaux", t2),
  " - ",
  t2.length,
  "=",
  t2.length - leven("poreau", t2)
);

// Function to get autocorrected results using Levenshtein distance
const getLevenshteinCorrections = (query, documents, maxDistance) => {
  // return documents
  // .map((doc) => {
  //   const distance = leven(query.toLowerCase(), doc.title.toLowerCase());
  //   return { title: doc.title, distance };
  // })
  // .filter((result) => result.distance <= maxDistance) // Filter results based on distance
  // .sort((a, b) => a.distance - b.distance) // Sort by closest match
  // .map((result) => result.title); // Return the titles

  return documents
    .map((doc) => {
      const distance = leven(query.toLowerCase(), doc.title.toLowerCase());
      return { title: doc.title, distance };
    })
    .sort((a, b) => a.distance - b.distance); // Sort by closest match
  // .map((result) => result.title); // Return the titles
};

const Search = () => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Article[]>([]);

  useEffect(() => {
    addDataToIndex(articles);
  }, []);

  // const getLevenshteinCorrections = (query, documents) => {
  //   const maxDistance = query.length <= 3 ? 1 : 3; // Tighter correction for shorter queries
  //   return documents
  //     .map((doc) => {
  //       const distance = leven(query.toLowerCase(), doc.title.toLowerCase());
  //       return { title: doc.title, distance };
  //     })
  //     .filter((result) => result.distance <= maxDistance)
  //     .sort((a, b) => a.distance - b.distance)
  //     .map((result) => result.title);
  // };

  const handleDebouncedSearch = useCallback(
    debounce((value: string) => {
      const searchResults = searchIndex(value);

      // const r = searchResults
      //   // .filter((r2) => r2.field === "title")
      //   .flatMap((result) => result.result.map((doc) => doc.doc.title));
      // console.log("r", searchResults);
      const formattedResults = searchResults.map((r) => r.doc);

      // Perform autocorrection using Levenshtein distance
      // if (searchResults.length === 0) {
      //   const t = getLevenshteinCorrections(query, articles, 3); // Fetch autocorrected results
      //   console.log("t", t);
      // }

      const l = suggestIndex(value, articles);
      console.log("l", l);

      setSuggestions(formattedResults);
    }, 500),
    []
  );

  const handleSearch = (_: ChangeEvent<{}>, value: string) => {
    setQuery(value);
    handleDebouncedSearch(value);
  };

  return (
    <Autocomplete
      freeSolo
      options={suggestions}
      getOptionLabel={(option: Article | string) =>
        typeof option === "string" ? option : option.title
      }
      inputValue={query}
      onInputChange={handleSearch}
      renderInput={(params) => (
        <TextField {...params} label="Search Articles" variant="outlined" />
      )}
    />
  );
};

export default Search;
