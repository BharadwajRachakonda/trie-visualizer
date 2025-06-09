"use client";
import { useState } from "react";
import { animate } from "framer-motion";

const Page = () => {
  type TrieNode =
    | string
    | number
    | {
        [key: string]: TrieNode | number | undefined;
      };

  const [dictionary, setDictionary] = useState<TrieNode>({});
  const [curr, setCurr] = useState<TrieNode>({});
  const [pathStack, setPathStack] = useState<string[]>([]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          animate(".input", { y: 0 }, { delay: 0.3, duration: 0.2 });

          const input = e.target.dictionary.value.trim();
          if (input === "") {
            console.error("Input cannot be empty");
            return;
          }

          try {
            const fixed = input.replaceAll("'", '"');
            const parsed = JSON.parse(fixed);
            setDictionary(parsed);
            setCurr(parsed);
            setPathStack([]);
          } catch (error) {
            console.error("Invalid JSON format:", error);
          }
        }}
      >
        <div className="flex flex-row items-center justify-center input z-50 drop-shadow-2xl drop-shadow-gray-950">
          <input
            type="text"
            name="dictionary"
            className="border-2 rounded-4xl my-5 m-2 p-2 bg-black text-white placeholder-gray-400"
            placeholder='{"a":{"end":1}, "b":{"end":1}}'
            onFocus={() => {
              animate(".input", { y: "50svh" }, { duration: 0.2 });
            }}
            onBlur={() => {
              animate(".input", { y: 0 }, { delay: 0.3, duration: 0.2 });
            }}
            required
            autoComplete="off"
            spellCheck="false"
          />
          <button
            type="submit"
            className="rounded-4xl border-2 border-white hover:bg-gray-100 bg-black text-white hover:text-black transition-all duration-300 px-4 py-2 font-semibold m-2 cursor-pointer"
          >
            enter
          </button>
        </div>
      </form>

      <br />
      <br />
      <br />

      <div className="grid place-items-center w-full">
        {JSON.stringify(curr) !== "{}" && curr !== "" && (
          <span className="py-4">
            {typeof curr === "object" &&
              Object.entries(curr).map(([element, value]) => (
                <span
                  key={element}
                  className="border-2 p-1 py-4 m-1 inline-block"
                >
                  <strong className="inline-block mr-1">{element}</strong>
                  <div className="inline-flex items-center gap-2">
                    {typeof value === "object" ? (
                      <span
                        className="cursor-pointer inline-flex w-5 h-5 border-2 rounded-full items-center justify-center"
                        onClick={() => {
                          setCurr(value);
                          setPathStack((prev) => [...prev, element]);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 -960 960 960"
                          className="w-4 h-4"
                          fill="#e3e3e3"
                        >
                          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                        </svg>
                      </span>
                    ) : (
                      <span className="text-white px-2">
                        = {value.toString()}
                      </span>
                    )}
                  </div>
                </span>
              ))}
            {(typeof curr === "number" || typeof curr === "string") && (
              <span className="border-2 p-1 py-4">
                <strong className="inline-block">{curr}</strong>
              </span>
            )}
          </span>
        )}
      </div>

      <br />
      <br />

      {JSON.stringify(curr) !== JSON.stringify(dictionary) && (
        <div className="flex flex-row items-center justify-center">
          <p
            className="cursor-pointer inline-flex w-5 h-5 border-2 rounded-full items-center justify-center"
            onClick={() => {
              const newPathStack = [...pathStack];
              newPathStack.pop();

              let newCurr: TrieNode = dictionary;
              for (const key of newPathStack) {
                if (
                  typeof newCurr !== "object" ||
                  newCurr === null ||
                  !(key in newCurr)
                ) {
                  console.error("Invalid path");
                  return;
                }
                newCurr = newCurr[key]!;
              }

              setCurr(newCurr);
              setPathStack(newPathStack);
            }}
          >
            -
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
