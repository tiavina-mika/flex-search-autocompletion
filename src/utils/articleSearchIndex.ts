// articleSearchIndex.ts
import leven from "leven";
import { Article } from "../components/Search";
import FlexSearch from "flexsearch";

const index = new FlexSearch.Document({
  document: {
    id: "id",
    index: ["title", "content"], // Fields to index
    store: ["id", "title", "content"], // Fields to retrieve in search results
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
