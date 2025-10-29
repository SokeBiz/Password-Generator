"use client";
import { useState, useEffect, useRef } from "react";

function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "dark" | "light") || getSystemTheme();
    }
    return "light";
  });

  const pwRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  function generatePassword(len: number) {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = lower.toUpperCase();
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()-_=+[]{};:,.<>?";
    const all = lower + upper + numbers + symbols;
    let pw = "";
    const array = new Uint32Array(len);
    window.crypto.getRandomValues(array);
    for (let i = 0; i < len; i++) {
      pw += all[array[i] % all.length];
    }
    return pw;
  }

  const handleGenerate = () => {
    const pw = generatePassword(length);
    setPassword(pw);
    setCopied(false);
    setCopyError("");
  };

  const handleCopy = async () => {
    if (!password) return;
    setCopyError("");
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } else {

        const range = document.createRange();
        const sel = window.getSelection();
        if (pwRef.current) {
          range.selectNodeContents(pwRef.current);
          sel?.removeAllRanges();
          sel?.addRange(range);
          document.execCommand("copy");
          sel?.removeAllRanges();
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } else {
          throw new Error("No password element to select");
        }
      }
    } catch (err) {
      setCopyError("Failed to copy. Please copy manually.");
      setCopied(false);
    }
  };


  const ThemeIcon = theme === "dark" ? "☀️" : "🌙";

  return (
    <div className={`flex min-h-screen items-center justify-center ${theme === "dark" ? "bg-zinc-900" : "bg-white"} transition-colors`}>
      <div className={`relative shadow-xl rounded-3xl px-8 py-12 flex flex-col gap-8 w-full max-w-md border ${theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-100"}`}>
        {/* Light or Dark mode toggle */}
        <button
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute right-7 top-7 p-2 rounded-full border border-transparent hover:border-blue-600 focus:outline-none transition text-blue-600 bg-transparent text-xl"
        >
          {ThemeIcon}
        </button>
        <h1 className={`text-3xl md:text-4xl font-extrabold text-blue-700 dark:text-blue-400 text-center uppercase tracking-tight`}>Password Generator</h1>
        <div className="flex flex-col gap-4 items-center">
          <label htmlFor="length" className="text-md font-semibold text-zinc-800 dark:text-zinc-200">
            Select password length
          </label>
          <input
            id="length"
            type="number"
            min={6}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-24 border-2 border-blue-500 rounded-lg p-2 text-center text-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-blue-700 transition"
          />
          <span className="text-xs text-zinc-500 dark:text-zinc-400">(Range: 6 - 64 characters)</span>
        </div>
        <button
          onClick={handleGenerate}
          className="bg-blue-600 text-white rounded-full px-8 py-3 text-lg font-semibold hover:bg-blue-700 transition-colors focus:outline-none mt-2 shadow-sm"
        >
          Generate Password
        </button>
        {password && (
          <div className="flex flex-col items-center gap-4 mt-2 animate-fade-in">
            <div
              ref={pwRef}
              className="bg-zinc-50 dark:bg-zinc-800 rounded-xl px-5 py-3 text-xl font-mono break-all select-all text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 shadow-sm transition-all">
              {password}
            </div>
            <button
              onClick={handleCopy}
              className={`mt-1 px-4 py-2 rounded-lg transition text-base font-bold bg-blue-600 text-white focus:outline-none shadow-md active:scale-95 ${copied ? 'bg-blue-800 scale-105' : 'hover:bg-blue-700'}`}
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
            {copyError && (
              <div className="text-xs text-red-600 font-medium mt-1">{copyError}</div>
            )}
          </div>
        )}
        <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-7">
          Securely generates random passwords in your browser - your data never leaves your device.
        </div>
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
