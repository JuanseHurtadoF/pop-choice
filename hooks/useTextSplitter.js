import { useState } from "react";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

function useTextSplitter() {
  const [error, setError] = useState(null);

  // 1. This function takes a string of text and splits it into chunks using Langchain
  // 2. The chunkSize and chunkOverlap parameters are optional
  const splitText = async (text) => {
    try {
      const splitter = new RecursiveCharacterTextSplitter({});
      const response = await splitter.createDocuments([text]);
      const chunks = response.map((chunk) => chunk.pageContent);
      return chunks;
    } catch (error) {
      setError(error);
      console.error(error);
    }
  };

  return { error, splitText };
}

export default useTextSplitter;
