import { motion } from 'motion/react';
import { useLive } from '../ui/Live';

/** Focusable, clickable SVG marker used across the technical diagrams. */
export function Hotspot({
  x,
  y,
  label,
  active,
  onSelect,
  labelSide = 'right',
}: {
  x: number;
  y: number;
  label: string;
  active: boolean;
  onSelect: () => void;
  labelSide?: 'left' | 'right' | 'top' | 'bottom';
}) {
  const live = useLive();
  const off = { right: [14, 4, 'start'], left: [-14, 4, 'end'], top: [0, -16, 'middle'], bottom: [0, 24, 'middle'] }[labelSide] as [
    number,
    number,
    'start' | 'end' | 'middle',
  ];
  return (
    <g
      role="button"
      tabIndex={0}
      aria-pressed={active}
      aria-label={`Inspect: ${label}`}
      data-cursor="Inspect"
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className="cursor-pointer outline-none [&:focus-visible_.hs-ring]:stroke-signal-soft"
      style={{ touchAction: 'manipulation' }}
    >
      <circle cx={x} cy={y} r={22} fill="transparent" />
      <motion.circle
        cx={x}
        cy={y}
        r={10}
        fill="none"
        stroke="#4fd8eb"
        strokeOpacity={0.5}
        initial={false}
        animate={live ? { r: active ? [10, 18] : [9, 14], opacity: [0.7, 0] } : { r: 10, opacity: 0 }}
        transition={live ? { duration: 1.8, repeat: Infinity, ease: 'easeOut' } : { duration: 0 }}
      />
      <circle className="hs-ring" cx={x} cy={y} r={7.5} fill={active ? '#4fd8eb' : '#03050a'} stroke="#4fd8eb" strokeWidth={1.5} />
      <circle cx={x} cy={y} r={2.5} fill={active ? '#03050a' : '#9be8f3'} />
      <text
        x={x + off[0]}
        y={y + off[1]}
        textAnchor={off[2]}
        className="pointer-events-none select-none font-mono max-sm:hidden"
        fontSize={11}
        letterSpacing={0.6}
        fill={active ? '#f3f6fa' : '#aab7c8'}
      >
        {label.toUpperCase()}
      </text>
    </g>
  );
}
