import SplitTextReveal from './SplitTextReveal'

interface Props {
  white: string
  ghost: string
}

export default function SectionHeading({ white, ghost }: Props) {
  return (
    <div className="mb-10 select-none leading-none">
      <div
        className="font-display font-bold uppercase text-text-primary"
        style={{ fontSize: 'clamp(44px, 8vw, 110px)', lineHeight: 1 }}
      >
        <SplitTextReveal text={white} />
      </div>
      <div
        className="font-display font-bold uppercase text-[rgb(38,36,35)]"
        style={{ fontSize: 'clamp(44px, 8vw, 110px)', lineHeight: 1 }}
      >
        <SplitTextReveal text={ghost} delay={0.15} />
      </div>
    </div>
  )
}
