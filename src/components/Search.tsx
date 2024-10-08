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
    title: "Network error",
    content: "An error related to network issues",
  },
  {
    id: 2,
    title: "Invalid input",
    content: "An error related to invalid user input",
  },
  {
    id: 3,
    title: "Server not responding",
    content: "An error related to server issues",
  },
];

const Search = () => {
  const [query, setQuery] = useState<string>("");
  const [options, setOptions] = useState<Article[]>([]);

  useEffect(() => {
    addDataToIndex(articles);
  }, []);

  const handleInputChange = (event: ChangeEvent<{}>, value: string) => {
    setQuery(value);
    const searchResults = searchIndex(value);
    setOptions(searchResults);
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option: Article) => option.title}
      inputValue={query}
      onInputChange={handleInputChange}
      renderInput={(params) => (
        <TextField {...params} label="Search Articles" variant="outlined" />
      )}
    />
  );
};

export default Search;
