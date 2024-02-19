"use client";
import React, { useState } from "react";
import styles from "./form.module.scss";
import { questions } from "@/data/questions";
import Button from "../ button/button";
import useMatchDocuments from "@/hooks/useMatchDocuments";

const Questions = () => {
  const [answers, setAnswers] = useState({});
  const [movie, setMovie] = useState(null);
  const { matchDocument } = useMatchDocuments();

  const handleChange = (e) => {
    e.preventDefault();
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!answers.favoriteMovie || !answers.mood || !answers.genre) {
      alert("Please answer all the questions");
      return;
    }

    const userInput = `My favorite movie is ${answers.favoriteMovie}. I'm in the mood for something ${answers.mood}. I'd like it to be ${answers.genre}.`;

    const match = await matchDocument(userInput);
    const matchJSON = JSON.parse(match);
    setMovie({
      title: matchJSON.title,
      description: matchJSON.description,
    });
  };

  return (
    <>
      {!movie ? (
        <div>
          {questions.map((question) => {
            return (
              <div key={question.name} className={styles.questionContainer}>
                <h2 className={styles.question}>{question.question}</h2>
                <textarea
                  name={question.name}
                  className={styles.textarea}
                  onChange={handleChange}
                  placeholder={question.placeholder}
                />
              </div>
            );
          })}
          <Button label={`Let's go`} handleClick={handleSubmit} />
        </div>
      ) : (
        <div>
          <h2 className={styles.title}>{movie.title}</h2>
          <p className={styles.description}>{movie.description}</p>
          <Button label="Go again" handleClick={() => setMovie(null)} />
        </div>
      )}
    </>
  );
};

export default Questions;
