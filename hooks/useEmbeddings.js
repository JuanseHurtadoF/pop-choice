import { useState } from "react";
import OpenAI from "openai";

function useEmbeddings() {
  const [error, setError] = useState(null);

  // 1. This function takes an array of text chunks and generates embeddings for each chunk using OpenAI
  // 2. It returns an array of { content: string, embedding: vector } objects
  const generateEmbeddings = async (content) => {
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    try {
      const embeddings = await Promise.all(
        content.map(async (textChunk) => {
          const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: textChunk,
          });
          return {
            content: textChunk,
            embedding: embeddingResponse.data[0].embedding,
          };
        })
      );
      return embeddings;
    } catch (error) {
      setError(error);
      console.error(error);
    }
  };

  return { error, generateEmbeddings };
}

export default useEmbeddings;
