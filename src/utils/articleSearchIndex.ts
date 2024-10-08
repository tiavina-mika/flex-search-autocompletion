// articleSearchIndex.ts
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
  rtl: true,
  optimize: true,
  encoder: "simple",
  threshold: 3, // Fuzziness level (higher means more tolerant to typos)
  resolution: 3, // Adjust the search resolution for better precision
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
      pluck: "title",
      enrich: true,
    });
  } catch (error) {
    console.error("Error during FlexSearch tokenization:", error);
    return [];
  }
};
