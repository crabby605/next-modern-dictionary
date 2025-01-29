"use client";

import { useState } from "react";
import { Search, Volume2 } from "lucide-react";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [wordData, setWordData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setWordData(null);
    setError(null);

    if (!searchQuery.trim()) return;

    try {
      const res = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${searchQuery}`
      );

      if (!res.ok) {
        throw new Error("Word not found");
      }

      const data = await res.json();
      setWordData(data[0]);
    } catch (err) {
      setError(err.message);
    }
  };

  const playAudio = (audioUrl) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  return (
      <div
          className="min-h-screen bg-black text-white"
          style={{
            fontFamily: '"M PLUS Rounded 1c", serif',
            marginLeft: '10px',
          }}
      >
        <Head>
          <title>Next Dictionary</title>
        </Head>

        <div className="text-center mb-8 mt-16">
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Search for a word
          </h1>
        </div>

        <form
            onSubmit={handleSearch}
            className="w-full max-w-2xl mx-auto px-4 mb-8"
        >
          <div className="flex items-center border border-gray-700 rounded-full p-2 bg-black shadow-md">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow bg-black text-white outline-none px-4 text-lg rounded-full"
            />
            <button type="submit" className="text-white">
              <Search className="w-6 h-6" />
            </button>
          </div>
        </form>


        {error && (
            <p className="text-red-500 px-4 text-lg">{error}</p>
        )}

        {wordData && (
            <div className="px-4 max-w-2xl text-left" style={{ marginLeft: '10px' }}>
              <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {wordData.word}
              </h1>

              {wordData.phonetics.map((phonetic, index) => (
                  <div key={index} className="mb-4 flex items-center gap-4">
                    {phonetic.text && <p className="text-xl">{phonetic.text}</p>}
                    {phonetic.audio && (
                        <button
                            onClick={() => playAudio(phonetic.audio)}
                            className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-600"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                    )}
                  </div>
              ))}

              <div className="mt-4">
                {wordData.meanings.map((meaning, index) => (
                    <div key={index} className="mb-6">
                      <h2 className="font-semibold text-2xl mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {meaning.partOfSpeech}
                      </h2>
                      <ul className="list-disc list-inside">
                        {meaning.definitions.map((def, idx) => (
                            <li key={idx} className="mb-2">
                              <p className="text-lg">{def.definition}</p>
                              {def.example && (
                                  <p className="italic text-gray-400 text-lg">
                                    Example: {def.example}
                                  </p>
                              )}
                            </li>
                        ))}
                      </ul>
                    </div>
                ))}
              </div>

              <p className="text-sm mt-4">
                <a
                    href={wordData.sourceUrls[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-400"
                >
                  Source
                </a>
              </p>
            </div>
        )}
      </div>
  );
}
