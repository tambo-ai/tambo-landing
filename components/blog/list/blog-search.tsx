'use client'

import { Search } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

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
  const [localValue, setLocalValue] = useState(value)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value
    setLocalValue(newValue)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue)
    }, 300)
  }

  return (
    <div className="relative">
      <Search className="absolute dr-left-16 top-1/2 -translate-y-1/2 dr-size-16 text-dark-grey" />
      <input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        className="w-full dr-pl-48 dr-pr-16 dr-py-12 bg-white border border-dark-grey dr-rounded-20 typo-p dr-text-14 text-black placeholder:text-dark-grey focus:outline-none focus:border-forest transition-colors duration-150"
        maxLength={200}
      />
    </div>
  )
}
