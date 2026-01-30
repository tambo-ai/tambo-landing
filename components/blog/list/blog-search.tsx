"use client";

import { Search } from "lucide-react";

interface BlogSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function BlogSearch({
  value,
  onChange,
  placeholder = "Search posts...",
}: BlogSearchProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      <Search
        style={{
          position: "absolute",
          left: "1.125rem",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#8aa8a0",
          width: "1.125rem",
          height: "1.125rem",
          pointerEvents: "none",
        }}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          display: "block",
          height: "3rem",
          width: "100%",
          borderRadius: "0.625rem",
          border: "1px solid #d4e5df",
          backgroundColor: "#ffffff",
          paddingLeft: "3rem",
          paddingRight: "1.25rem",
          fontSize: "1rem",
          color: "#1a2e28",
          outline: "none",
          boxSizing: "border-box",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#8aa8a0";
          e.target.style.boxShadow = "0 0 0 3px rgba(138, 168, 160, 0.1)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#d4e5df";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}
