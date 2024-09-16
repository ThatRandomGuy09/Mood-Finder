/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { emotionConfig } from "./config";
import { ColorRing } from "react-loader-spinner";

interface emotionProps {
  label: string;
  score: number;
}
interface EmotionConfig {
  [label: string]: {
    colorHex: string;
    emoji: string;
  };
}

export default function Home() {
  const defaultColor = "#cccccc";
  const [rows, setRows] = useState(2);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<emotionProps[]>([]);
  const [color, setColor] = useState(defaultColor);
  const [tagsVisible, setTagsVisible] = useState(false);
  function handlerInput(event: ChangeEvent<HTMLTextAreaElement>): void {
    setInput(event.target.value);

    const newRows = Math.max(1, Math.ceil(event.target.scrollHeight / 20));
    setRows(newRows);
  }

  useEffect(() => {
    const inputTimeout = setTimeout(() => {
      runPredictions();
    }, 1000);

    return () => clearTimeout(inputTimeout);
  }, [input]);

  useEffect(() => {
    handleColor();
    setTagsVisible(true);
  }, [output]);

  function handleColor() {
    if (output && output.length > 0) {
      const colorKey = output[0].label;
      const colorHex = (emotionConfig as EmotionConfig)[colorKey].colorHex;
      setColor(colorHex);
    }
  }

  async function runPredictions() {
    if (input) {
      setLoading(true);
      setTagsVisible(false);
      const res = await axios.post("api/emotion", { input: input });
      setOutput(res.data.filteredResponse);
      setLoading(false);
    }
  }

  return (
    <>
      <main
        style={{ background: color + "aa" }}
        transition-all
        delay-500
        className="gap-4 flex min-h-screen flex-col items-center justify-center py-2"
      >
        <h1 className="lg:text-4xl text-2xl font-mono tracking-tight items-center">
          🎨 Inside Out Crew
        </h1>
        <div className=" w-1/2 min-w-80 border-2 border-black p-4 rounded-lg">
          <textarea
            rows={rows}
            onChange={handlerInput}
            placeholder="How are you feeling ?"
            className=" resize-none w-full text-sm placeholder:text-gray-400 bg-transparent outline-none block"
          ></textarea>
        </div>
        <p>{"-> " + input}</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {output.map(({ label, score }) => {
            return (
              <span
                style={{ opacity: tagsVisible ? 1 : 0 }}
                key={label}
                className=" transition-all cursor-pointer bg-indigo-100 text-indigo-800 text-lg px-4 py-1 rounded-full border border-indigo-400"
              >
                {label}
                {(emotionConfig as EmotionConfig)[label].emoji}
              </span>
            );
          })}
        </div>
        {loading && renderLoader()}
      </main>
    </>
  );

  function renderLoader() {
    return (
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
      />
    );
  }
}
