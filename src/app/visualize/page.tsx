"use client";

import { motion, animate } from "framer-motion";
const page = () => {
  let dictionary = {};

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          animate(".input", { y: 0 }, { delay: 0.3, duration: 0.2 });
          if (e.target.dictionary.value.trim() === "") {
            console.error("Input cannot be empty");
            return;
          } else {
            try {
              dictionary = JSON.parse(e.target.dictionary.value);
              console.log(dictionary);
            } catch (error) {
              console.error("Invalid JSON format:", error);
            }
          }
        }}
      >
        <div className="flex flex-row items-center justify-center input z-50 drop-shadow-2xl drop-shadow-gray-950">
          <input
            type="text"
            name="dictionary"
            className="border-2 rounded-4xl my-5 m-2 p-2 bg-black"
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
          <input
            type="submit"
            value="enter"
            className="rounded-4xl border-2 border-white hover:bg-gray-100 bg-black hover:text-black transition-all duration-300 px-4 py-2 font-semibold m-2 cursor-pointer"
          />
        </div>
      </form>
    </div>
  );
};

export default page;
