// articleSearchIndex.ts
import leven from "leven";
import { Article } from "../components/Search";
import FlexSearch from "flexsearch";

const index = new FlexSearch.Document({
  document: {
    id: "id",
    index: ["title", "content"], // Fields to index
    store: ["title", "content"], // Fields to retrieve in search results
  },
  language: "fr",
  tokenize: "forward",
  // optimize: true,
  encoder: "simple",
  threshold: 3, // Fuzzy search tolerance for typos
  resolution: 5, // Higher resolution for better results
});

export const addDataToIndex = (data: Article[]) => {
  data.forEach((item) => {
    index.add(item);
  });
};

export const searchIndex = (query: string) => {
  try {
    return index.search(query, {
      index: ["title", "content"],
      suggest: true,
      pluck: "title", // we only need the title
      enrich: true, // enrich the result format
    });
  } catch (error) {
    console.error("Error during FlexSearch tokenization:", error);
    return [];
  }
};

export const suggestIndex = (query: string, data: Article[]) => {
  try {
    const suggestions = data.filter(
      (item: Article) => leven(query, item.title) <= 2
    );
    return suggestions;
  } catch (error) {
    console.error("Error during FlexSearch suggestion:", error);
    return [];
  }
};
