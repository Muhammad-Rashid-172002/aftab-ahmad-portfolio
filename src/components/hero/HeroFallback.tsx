/** Lightweight SVG rendering of the hero scene, used when WebGL is unavailable or still loading. */
export function HeroFallback({ animate = true }: { animate?: boolean }) {
  const tower = (x: number, base: number, h: number, w: number, o = 1) => {
    const segs = 9;
    const lines: string[] = [];
    for (let i = 0; i < segs; i++) {
      const y0 = base - (h / segs) * i;
      const y1 = base - (h / segs) * (i + 1);
      const w0 = w * (1 - (i / segs) * 0.7);
      const w1 = w * (1 - ((i + 1) / segs) * 0.7);
      lines.push(`M${x - w0} ${y0} L${x + w1} ${y1} M${x + w0} ${y0} L${x - w1} ${y1} M${x - w1} ${y1} H${x + w1}`);
    }
    return (
      <g stroke="#8b9bb0" strokeOpacity={o} fill="none">
        <path d={`M${x - w} ${base} L${x - w * 0.3} ${base - h} M${x + w} ${base} L${x + w * 0.3} ${base - h}`} strokeWidth={2} />
        <path d={lines.join(' ')} strokeWidth={0.8} strokeOpacity={0.6} />
        <circle cx={x} cy={base - h - 10} r={2.5} fill="#ff5a5a" stroke="none" />
      </g>
    );
  };
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-950" aria-hidden>
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <linearGradient id="fbSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#03050a" />
            <stop offset="0.7" stopColor="#081322" />
            <stop offset="1" stopColor="#03050a" />
          </linearGradient>
          <linearGradient id="fbBeam" x1="0" x2="1">
            <stop offset="0" stopColor="#4fd8eb" stopOpacity="0.05" />
            <stop offset="1" stopColor="#4fd8eb" stopOpacity="0.7" />
          </linearGradient>
          <pattern id="fbGrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="#4fd8eb" strokeOpacity="0.07" />
          </pattern>
        </defs>
        <rect width="1440" height="900" fill="url(#fbSky)" />
        <g transform="translate(0 640) scale(1 .35)">
          <rect y="0" width="1440" height="900" fill="url(#fbGrid)" />
        </g>
        <path d="M0 640 L240 560 L520 610 L760 540 L1040 600 L1240 560 L1440 620 V640 Z" fill="#0a1524" />
        {tower(560, 640, 260, 22, 0.5)}
        {tower(1180, 900, 640, 70)}
        <rect x="1086" y="296" width="40" height="40" rx="4" fill="#58677a" />
        <ellipse cx="1080" cy="316" rx="14" ry="38" fill="#e8edf3" />
        <ellipse cx="572" cy="402" rx="3" ry="8" fill="#c9d3df" />
        <path d="M1070 300 L575 398 L575 406 L1070 334 Z" fill="url(#fbBeam)" opacity="0.55" />
        <line x1="1070" y1="316" x2="575" y2="402" stroke="#9be8f3" strokeWidth="1.2" strokeDasharray="6 10" className={animate ? 'animate-dash' : ''} />
      </svg>
    </div>
  );
}
