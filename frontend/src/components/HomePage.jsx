import React, { useState } from "react";
import { Copy, ExternalLink, Check, RefreshCcw } from "lucide-react";
import Dropdown from "./Dropdown";
import TypingEffect from "./TypingEffect"; // import TypingEffect here
import "../styles/animations.css";
import { getEnhancedPrompt } from "../axios";

function formatPrompt(text) {
  if (!text) return "";
  let formatted = text.replace(/\\n/g, "\n");
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, (_, p1) => p1.toUpperCase());
  return formatted;
}

export default function AIPromptEnhancer() {
  const [originalPrompt, setOriginalPrompt] = useState("");
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [tone, setTone] = useState("Select output style");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);

  const enhancePrompt = async () => {
    if (tone === "Select output style") {
      setError("Please select an output style.");
      return;
    }
    if (!originalPrompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }
    setError("");
    setLoading(true);
    setEnhancedPrompt("");
    try {
      const response = await getEnhancedPrompt(originalPrompt, tone);
      const textRaw =
        typeof response === "string"
          ? response
          : response.improvedPrompt || response.text || JSON.stringify(response);
      const text = formatPrompt(textRaw);
      setEnhancedPrompt(text);
      setHasGeneratedOnce(true);
    } catch (err) {
      setError("Failed to get response. Please try again.");
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    if (!enhancedPrompt) return;
    navigator.clipboard.writeText(enhancedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-gray-200 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-400 text-black w-full text-center py-5 px-4">
          <h1 className="text-4xl font-bold mb-1">AI Prompt Enhancer</h1>
          <p className="text-sm text-black">
            Convert basic prompts into optimized instructions
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Prompt input */}
          <div>
            <label className="block text-lg font-medium mb-1 text-gray-700">
              Original Prompt
            </label>
            <textarea
              className="textarea textarea-bordered rounded-xl w-full min-h-[90px] focus:outline-none focus:ring-2 focus:ring-primary"
              value={originalPrompt}
              onChange={(e) => setOriginalPrompt(e.target.value)}
              placeholder="Enter your prompt"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <button
                className={`btn rounded-md border-none text-white px-4 ${loading
                    ? "bg-blue-500 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-700"
                  }`}
                onClick={enhancePrompt}
              >
                {loading ? "Loading..." : "Enhance Prompt"}
              </button>

              {hasGeneratedOnce && (
                <button
                  onClick={enhancePrompt}
                  disabled={loading}
                  title="Try Again"
                  className={`p-1 text-blue-500 hover:text-blue-700 transition ${loading ? "cursor-not-allowed opacity-50" : ""
                    }`}
                >
                  <RefreshCcw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
              )}
            </div>

            <Dropdown tone={tone} setTone={setTone} />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-600 font-semibold">{error}</p>}

          {/* Enhanced Prompt Output */}
          <div>
            <label className="block text-lg font-medium mb-1 text-gray-700">
              Enhanced Prompt
            </label>
            {/* Instead of textarea, using a div styled like textarea */}
            <div
              className="textarea textarea-bordered rounded-xl w-full min-h-[180px] focus:outline-none focus:ring-2 focus:ring-primary whitespace-pre-wrap overflow-y-auto"
              style={{
                fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                fontFeatureSettings: 'normal',
                fontVariationSettings: 'normal',
              }}
            >
              {loading ? (
                <p>Waiting for response...</p>
              ) : enhancedPrompt ? (
                <TypingEffect text={enhancedPrompt} speed={15} />
              ) : (
                <p className="text-gray-400 select-none">
                  Your enhanced prompt will come here...
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-3">
              <button
                className="btn btn-outline btn-sm border-gray-700 text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={copyToClipboard}
                disabled={!enhancedPrompt}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1 text-green-600 animate-pulse" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </button>

              <a
                href="https://chat.openai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm border-gray-700 text-gray-700 hover:bg-gray-100"
              >
                <ExternalLink className="w-4 h-4 mr-1" /> ChatGPT
              </a>

              <a
                href="https://claude.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm border-gray-700 text-gray-700 hover:bg-gray-100"
              >
                <ExternalLink className="w-4 h-4 mr-1" /> Claude
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
