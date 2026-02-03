'use client'

import cn from 'clsx'
import { Activity, useEffect, useState } from 'react'
import s from './dropdown.module.css'

type DropdownProps = {
  className?: string
  placeholder?: string
  defaultValue?: number
  options?: string[]
  onChange?: (value: number) => void
}

export function Dropdown({
  className,
  placeholder = 'Select Option',
  defaultValue,
  options = [],
  onChange,
}: DropdownProps) {
  const [isOpened, setIsOpened] = useState(false)
  const [selected, setSelected] = useState(defaultValue)

  useEffect(() => {
    function onClick() {
      setIsOpened(false)
    }

    window.addEventListener('click', onClick, false)

    return () => {
      window.removeEventListener('click', onClick, false)
    }
  }, [])

  return (
    <div className={cn('relative w-full', className)}>
      <button
        type="button"
        className={cn(
          'relative flex items-center justify-between w-full dr-py-16 dr-px-20 dt:dr-py-18 dt:dr-px-24 bg-off-white border-2 border-dark-grey dr-rounded-12 dt:dr-rounded-16 text-black font-[system-ui] dr-text-15 dt:dr-text-15 leading-[1.6] transition-all duration-300 ease-out-cubic cursor-pointer hover:border-teal',
          isOpened && 'border-teal! bg-white!'
        )}
        onClick={(e) => {
          e.stopPropagation()
          setIsOpened(!isOpened)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setIsOpened(false)
          }
        }}
      >
        <span>{selected !== undefined && !isOpened ? options[selected] : placeholder}</span>
      </button>
      {/* Activity pre-renders options for instant first open */}
      <Activity mode={isOpened ? 'visible' : 'hidden'}>
        <div
          className={cn(
            'absolute dr-top-56 dt:dr-top-58 flex flex-col z-100 w-full bg-white border-2 border-dark-grey dr-rounded-12 dt:dr-rounded-16 shadow-[0_8px_32px_rgba(15,26,23,0.12)] dr-p-8 dt:dr-p-8 overflow-y-auto overflow-x-hidden',
            !isOpened && 'pointer-events-none invisible',
            s.options
          )}
          aria-hidden={!isOpened}
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((value, i) => (
            <button
              type="button"
              className="text-black dr-py-12 dr-px-16 dt:dr-py-12 dt:dr-px-16 text-left whitespace-nowrap w-full dr-rounded-8 dt:dr-rounded-8 bg-transparent transition-all duration-200 ease-out-cubic font-[system-ui] dr-text-15 dt:dr-text-15 cursor-pointer hover:bg-teal hover:text-black"
              onClick={() => {
                setSelected(i)
                setIsOpened(false)
                onChange?.(i)
              }}
              key={`option-${value}`}
            >
              {value}
            </button>
          ))}
        </div>
      </Activity>
    </div>
  )
}
