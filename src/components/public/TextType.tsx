'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'

interface Props {
  text: string | string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  initialDelay?: number
  loop?: boolean
  className?: string
  cursorCharacter?: string
  showCursor?: boolean
}

export default function TextType({
  text,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 2000,
  initialDelay = 0,
  loop = true,
  className = '',
  cursorCharacter = '|',
  showCursor = true,
}: Props) {
  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text])

  const [displayedText, setDisplayedText] = useState('')
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [textIndex, setTextIndex] = useState(0)
  const [started, setStarted] = useState(false)

  // Handle initial delay
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), initialDelay)
    return () => clearTimeout(t)
  }, [initialDelay])

  useEffect(() => {
    if (!started) return

    const currentText = textArray[textIndex]
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting) {
      if (charIndex < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayedText(currentText.slice(0, charIndex + 1))
          setCharIndex(c => c + 1)
        }, typingSpeed)
      } else {
        // Finished typing — pause then delete
        if (!loop && textIndex === textArray.length - 1) return
        timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
      }
    } else {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(d => d.slice(0, -1))
        }, deletingSpeed)
      } else {
        // Finished deleting — move to next word
        setIsDeleting(false)
        setTextIndex(i => (i + 1) % textArray.length)
        setCharIndex(0)
      }
    }

    return () => clearTimeout(timeout)
  }, [started, charIndex, displayedText, isDeleting, textIndex, textArray, typingSpeed, deletingSpeed, pauseDuration, loop])

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span className="animate-cursor-blink ml-0.5 font-thin opacity-80">
          {cursorCharacter}
        </span>
      )}
    </span>
  )
}
