// searchIndex.js
import { Article } from "@/components/Search";
import FlexSearch from "flexsearch";

// const index = new FlexSearch({
//   encode: "icase",
//   tokenize: "forward",
//   threshold: 1,
//   resolution: 3,
//   depth: 3,
//   doc: {
//     id: "id",
//     field: ["name", "description"],
//   },
// });

const index = new FlexSearch.Document({
  document: { id: "id", index: ["title", "content"] },
});

export const addDataToIndex = (data: Article[]) => {
  data.forEach((item) => {
    index.add(item);
  });
};

export const searchIndex = (query: string) => {
  try {
    return index.search(query, { index: ["name", "description"] });
  } catch (error) {
    console.error("Error during FlexSearch tokenization:", error);
    return [];
  }
};
