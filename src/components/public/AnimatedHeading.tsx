'use client'

import TextType from './TextType'

const words = ['PRODUCT', 'GRAPHICS', 'MOTION']

export default function AnimatedHeading() {
  return (
    <div className="mb-10 select-none leading-none">
      {/* Animated white line */}
      <div
        className="font-display font-bold uppercase text-text-primary block"
        style={{ fontSize: 'clamp(44px, 8vw, 110px)', lineHeight: 1 }}
      >
        <TextType
          text={words}
          typingSpeed={70}
          deletingSpeed={35}
          pauseDuration={2200}
          initialDelay={300}
          cursorCharacter="|"
          showCursor
        />
      </div>
      {/* Ghost / muted static line */}
      <div
        className="font-display font-bold uppercase text-[rgb(38,36,35)]"
        style={{ fontSize: 'clamp(44px, 8vw, 110px)', lineHeight: 1 }}
      >
        DESIGNER
      </div>
    </div>
  )
}
