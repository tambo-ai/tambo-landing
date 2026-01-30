"use client";

import { Search } from "lucide-react";
import { useCallback, useRef } from "react";

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
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounced call (300ms)
      debounceTimerRef.current = setTimeout(() => {
        onChange(newValue);
      }, 300);
    },
    [onChange]
  );

  return (
    <div className="blog-search">
      <Search className="blog-search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={value}
        onChange={handleChange}
        className="blog-search-input"
        maxLength={200}
      />
    </div>
  );
}
