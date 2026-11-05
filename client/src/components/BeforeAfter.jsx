import { useCallback, useRef, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import { SmartImage } from './ui.jsx';

// Draggable before/after comparison. Works with mouse, touch (pointer events) and keyboard arrows.
export default function BeforeAfter({ before, after, alt = 'Project' }) {
  const ref = useRef(null);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const move = useCallback((clientX) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl bg-navy shadow-card sm:aspect-[16/9]"
      style={{ touchAction: 'pan-y' }}
      onPointerDown={(e) => { setDragging(true); e.currentTarget.setPointerCapture(e.pointerId); move(e.clientX); }}
      onPointerMove={(e) => dragging && move(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      <SmartImage src={after} alt={`${alt}: after`} className="absolute inset-0 h-full w-full object-cover" draggable="false" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <SmartImage src={before} alt={`${alt}: before`} className="h-full w-full object-cover" draggable="false" />
      </div>

      <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-navy/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">Before</span>
      <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-widest text-navy">After</span>

      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-gold" style={{ left: `${pos}%` }}>
        <div
          role="slider" tabIndex={0} aria-label="Before and after slider" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 5));
            if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 5));
          }}
          className="pointer-events-auto absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-white bg-gold text-navy shadow-xl"
        >
          <MoveHorizontal className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
