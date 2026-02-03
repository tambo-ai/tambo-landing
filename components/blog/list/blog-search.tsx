'use client'

import { Search } from 'lucide-react'
import { useCallback, useRef } from 'react'

interface BlogSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function BlogSearch({
  value,
  onChange,
  placeholder = 'Search posts...',
}: BlogSearchProps) {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
        onChange(newValue)
      }, 300)
    },
    [onChange]
  )

  return (
    <div className="relative">
      <Search className="absolute dr-left-16 top-1/2 -translate-y-1/2 dr-size-16 text-black/40" />
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={value}
        onChange={handleChange}
        className="w-full dr-pl-48 dr-pr-16 dr-py-12 bg-white border border-dark-grey dr-rounded-20 typo-p dr-text-14 text-black placeholder:text-black/40 focus:outline-none focus:border-forest transition-colors duration-150"
        maxLength={200}
      />
    </div>
  )
}
