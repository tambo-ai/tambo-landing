import cn from 'clsx'

export function DashedBorder({
  className,
  style,
}: {
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      aria-hidden="true"
      width="100%"
      height="100%"
      // viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
      className={cn('will-change-transform', className)}
      style={style}
    >
      <rect
        width="100%"
        height="100%"
        fill="none"
        rx="100%"
        ry="100%"
        stroke="#008346"
        strokeWidth="1"
        strokeDasharray="6, 6"
        strokeDashoffset="0"
        strokeLinecap="square"
        style={{
          animation: 'dashoffset-move 0.4s linear infinite',
        }}
      />
      {/* {!process.env.NEXT_PUBLIC_DISABLE_STROKE_ANIMATION && (
        <style>
          {`@keyframes dashoffset-move {
            to {
                stroke-dashoffset: +12;
            }
        }`}
        </style>
      )} */}
    </svg>
  )
}
