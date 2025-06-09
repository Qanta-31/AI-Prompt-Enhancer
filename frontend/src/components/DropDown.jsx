import React, { useState, useEffect, useRef } from "react";
import "../styles/animations.css";

const options = [
  "Default",
  "Casual",
  "Professional",
  "Code",
  "Human",
  "Witty",
  "Image Generation",
  "Concise",
  "Poetic",
  "Detailed",
];

export default function Dropdown({ tone, setTone }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setTone(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
<button
  onClick={() => setIsOpen(!isOpen)}
  className="btn bg-blue-500 hover:bg-blue-700 border-none px-4 py-2 rounded-md focus:outline-none flex items-center gap-2 w-56 justify-between"
>
  {tone || "Select Output Style"}
  <span className={`transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
    ▼
  </span>
</button>

{isOpen && (
  <ul className="absolute z-20 mt-2 w-56 bg-gray-800 bg-opacity-100 rounded-md shadow-lg max-h-60 overflow-auto opacity-100">
    <li className="px-4 py-2 text-sm text-gray-400 cursor-default select-none">
      Select output style
    </li>
    {options.map((option) => (
      <li
        key={option}
        onClick={() => handleSelect(option)}
        className="dropdown-item px-4 py-2 cursor-pointer hover:bg-blue-600 hover:text-white transition-all duration-200 ease-in-out hover:scale-[1.02]"
      >
        {option}
      </li>
    ))}
  </ul>
)}

    </div>
  );
}
