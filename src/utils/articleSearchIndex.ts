// utils/articleSearchIndex.ts
import leven from "leven";
import { Article } from "../components/Search";
import FlexSearch from "flexsearch";

// Create a FlexSearch index
const index = new FlexSearch.Document({
  document: {
    id: "id",
    index: ["title", "content"], // Fields to index for search
    store: ["id", "title", "content"], // Fields to retrieve in results
  },
  language: "fr", // Language support for tokenization
  tokenize: "forward", // Tokenization for autocompletion
  encoder: "simple", // Simplified text encoding for search
  threshold: 3, // Fuzzy search tolerance
  resolution: 5, // Higher resolution for more accurate results
});

// Add data to the index
export const addDataToIndex = (data: Article[]) => {
  data.forEach((item) => {
    index.add(item);
  });
};

export const searchIndex = async (query: string) => {
  try {
    // BUG: puck does not exists in flexseach types
    const result = await (index as any).searchAsync(query, {
      index: ["title", "content"],
      suggest: true,
      pluck: "title", // we only need the title
      enrich: true, // enrich the result format
    });

    return result;
  } catch (error) {
    console.error("Error during FlexSearch tokenization:", error);
    return [];
  }
};

/**
 * Get autocorrected results using Levenshtein distance
 * e.g: fexsearch => flexsearch
 */
export const suggestIndex = (query: string, data: Article[]) => {
  const suggestions = data.filter((item: Article) => {
    const maxDistance = item.title.length - leven(query.toLocaleLowerCase(), item.title.toLocaleLowerCase());
    return maxDistance >= 6;
  });
  return suggestions;
};
