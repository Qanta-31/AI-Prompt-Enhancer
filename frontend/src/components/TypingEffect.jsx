import React, { useEffect, useState } from "react";

export default function TypingEffect({ text = "", speed = 15 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText("");
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (!text || index >= text.length) return;

    const timeout = setTimeout(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      setIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timeout);
  }, [index, text, speed]);

  return (
    <pre className="whitespace-pre-wrap font-inherit">
      {displayedText}
    </pre>
  );
}
