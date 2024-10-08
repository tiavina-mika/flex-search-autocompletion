import { useState, useEffect, ChangeEvent } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { addDataToIndex, searchIndex } from "../utils/article.utils";

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

  const handleInputChange = (_: ChangeEvent<{}>, value: string) => {
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
