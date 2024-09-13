"use client";
import { ChangeEvent, useEffect, useState } from "react";

export default function Home() {
  const [rows, setRows] = useState(2);
  const [input, setInput] = useState("");
  // const [loading, setLoading] = useState();

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

  function runPredictions() {}

  return (
    <>
      <main className="gap-4 flex min-h-screen flex-col items-center justify-center py-2">
        <h1 className="lg:text-4xl text-2xl font-mono tracking-tight items-center">
          🎨 Mood Finder
        </h1>
        <div className="border-2 border-black p-4 rounded-lg">
          <textarea
            rows={rows}
            onChange={handlerInput}
            placeholder="How are you feeling ?"
            className=" resize-none w-full text-sm placeholder:text-gray-400 bg-transparent outline-none block"
          ></textarea>
        </div>
        <p>{"-> " + input}</p>
      </main>
    </>
  );
}
