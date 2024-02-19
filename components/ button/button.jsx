"use client";
import styles from "./button.module.scss";
import useTextSplitter from "@/hooks/useTextSplitter";
import useEmbeddings from "@/hooks/useEmbeddings";
import useMatchDocuments from "@/hooks/useMatchDocuments";
import movies from "../../data/movies";
import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";

const Button = ({ label, handleClick }) => {
  const { splitText } = useTextSplitter();
  const { generateEmbeddings } = useEmbeddings();
  const { matchDocument } = useMatchDocuments();

  const handleTextChunks = async () => {
    // create supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // split text into chunks
    const textChunks = await splitText(movies, { chunkOverlap: 10 });

    // generate embeddings for each chunk
    const embeddings = await generateEmbeddings(textChunks);

    // insert chunks and vectors into supabase
    const { data, error } = await supabase
      .from("movies")
      .insert(embeddings)
      .select();
  };

  return (
    <button onClick={handleClick} className={styles.button}>
      {label}
    </button>
  );
};

export default Button;

export async function getStaticProps() {
  const text = fs.readdirSync(postsDirectory);
}
