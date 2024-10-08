import { useState, useEffect, ChangeEvent, useMemo } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { addDataToIndex, searchIndex } from "../utils/article.utils";
// import FlexSearch from "flexsearch";

export interface Article {
  id: number;
  title: string;
  content: string;
}

const articles: Article[] = [
  {
    id: 1,
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

  useEffect(() => {
    addDataToIndex(articles);
  }, []);

  // const searchIndex = useMemo(() => {
  //   const index = new FlexSearch.Document({
  //     document: {
  //       id: "id",
  //       index: ["title", "content"], // Fields to index
  //     },
  //     language: "fr",
  //     tokenize: "forward",
  //     rtl: true,
  //     optimize: true,
  //     encoder: "simple",
  //     threshold: 3, // Fuzziness level (higher means more tolerant to typos)
  //     resolution: 3, // Adjust the search resolution for better precision
  //   });

  //   articles.forEach((item) => {
  //     index.add(item);
  //   });

  //   return index;
  // }, [articles]);

  console.log("suggestions", suggestions);

  const handleInputChange = (event: ChangeEvent<{}>, value: string) => {
    console.log("value", value);
    setQuery(value);
    const searchResults = searchIndex(value);

    // const r = searchResults
    //   // .filter((r2) => r2.field === "title")
    //   .flatMap((result) => result.result.map((doc) => doc.doc.title));
    // console.log("r", searchResults);
    const formattedResults = searchResults.map((r) => r.doc);

    setSuggestions(formattedResults);
  };

  return (
    <Autocomplete
      freeSolo
      options={suggestions}
      getOptionLabel={(option: Article | string) =>
        typeof option === "string" ? option : option.title
      }
      inputValue={query}
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <TextField {...params} label="Search Articles" variant="outlined" />
      )}
    />
  );
};

export default Search;
