"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  // ✅ start in dark mode
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.body.style.backgroundColor = dark ? "#000000" : "#ffffff";
    document.body.style.color = dark ? "#ffffff" : "#000000";
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-4 py-2 rounded-lg border text-sm font-semibold
                 bg-white text-black hover:bg-gray-200 transition"
    >
      {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}
