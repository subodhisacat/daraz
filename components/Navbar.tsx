import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Instagram } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full bg-black px-6 py-4 flex items-center justify-between">
      <Link
        href="/"
        className="font-extrabold text-xl text-white hover:text-gray-300"
      >
        Daraz Finds NP
      </Link>

      <div className="flex items-center gap-4">
        {/* Instagram */}
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-pink-500 transition-colors duration-300"
        >
          <Instagram className="w-5 h-5" />
        </a>

        {/* TikTok (inline SVG) */}
        <a
          href="https://www.tiktok.com/@draznp"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors duration-300"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 fill-current"
            aria-hidden="true"
          >
            <path d="M21 8.5c-1.7 0-3.4-.5-4.8-1.5v6.7c0 3.4-2.8 6.3-6.3 6.3S3.6 17.1 3.6 13.6s2.8-6.3 6.3-6.3c.3 0 .6 0 .9.1v3.4c-.3-.1-.6-.2-.9-.2-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3V2h3.2c.2 1.7 1.2 3.3 2.8 4.1.9.4 1.9.6 2.9.6v2.8z" />
          </svg>
        </a>

        <ThemeToggle />
      </div>
    </nav>
  );
}
