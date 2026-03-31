'use client'

import TextType from './TextType'

const words = ['PRODUCT', 'GRAPHICS', 'MOTION']

export default function AnimatedHeading() {
  return (
    <div className="mb-10 select-none leading-none">
      {/* Animated white line */}
      <div
        className="font-display font-black uppercase text-text-primary block"
        style={{ fontSize: 'clamp(36px, 6.8vw, 96px)', lineHeight: 1, WebkitTextStroke: '1.5px white' }}
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
        className="font-display font-black uppercase text-[rgb(38,36,35)]"
        style={{ fontSize: 'clamp(36px, 6.8vw, 96px)', lineHeight: 1, WebkitTextStroke: '1.5px rgb(38,36,35)' }}
      >
        DESIGNER
      </div>
    </div>
  )
}
