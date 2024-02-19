import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const useMatchDocuments = () => {
  const [error, setError] = useState(null);
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // 1. This function takes a string and converts it into an embedding using OpenAI
  // 2. It then compares the embedding to the embeddings in supabase
  const matchDocument = async (input) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const embeddingResponse = await openai.embeddings.create({
      response_format: { type: "json_object" },
      model: "text-embedding-ada-002",
      input: input,
    });
    const embedding = embeddingResponse.data[0].embedding;

    const { data } = await supabase.rpc("match_movies", {
      query_embedding: embedding,
      match_threshold: 0.5,
      match_count: 1,
    });

    const chatMessages = [
      {
        role: "system",
        content: `You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - some context about movies and a question. Your main job is to respond with the title and description of the movie in a JSON format`,
      },
      {
        role: "user",
        content: `You will reply in JSON format using the following type {title: [movie title], description: [short movie description]}. For example {title: "The Matrix", description: "A computer hacker learns about the true nature of reality and his role in the war against its controllers."}.`,
      },
      {
        role: "user",
        content: `Context: ${data[0].content} User input: ${input}`,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: chatMessages,
      temperature: 0.5,
      frequency_penalty: 0.5,
    });

    return response.choices[0].message.content;
  };

  return { error, matchDocument };
};

export default useMatchDocuments;
