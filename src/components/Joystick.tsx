import { useRef, useEffect, useCallback } from 'react';
import type { Point } from '../types';

const OUTER_R = 52;        // outer pad radius px
const MAX_SPEED = 1.4;     // m/s at full deflection (normal walking pace)
const DEAD_ZONE = 0.06;    // ignore tiny inputs

interface Props {
  simPosition: Point | null;
  onPositionChange: (point: Point) => void;
  speed: number; // multiplier applied on top of MAX_SPEED
}

export function Joystick({ simPosition, onPositionChange, speed }: Props) {
  const knobRef = useRef<HTMLDivElement>(null);

  // Keep latest values in refs so the RAF loop never goes stale
  const vecRef = useRef({ dx: 0, dy: 0 });
  const posRef = useRef<Point | null>(simPosition);
  const cbRef = useRef(onPositionChange);
  const speedRef = useRef(speed);
  const activeRef = useRef(false);
  const lastTimeRef = useRef(0);

  posRef.current = simPosition;
  cbRef.current = onPositionChange;
  speedRef.current = speed;

  // RAF movement loop
  useEffect(() => {
    let rafId = 0;

    function loop(now: number) {
      rafId = requestAnimationFrame(loop);
      if (!activeRef.current) return;

      const { dx, dy } = vecRef.current;
      const mag = Math.sqrt(dx * dx + dy * dy);
      if (mag < DEAD_ZONE) return;

      const dt = lastTimeRef.current ? (now - lastTimeRef.current) / 1000 : 0;
      lastTimeRef.current = now;
      if (dt <= 0 || dt > 0.2) return; // skip large gaps (tab switch etc.)

      const pos = posRef.current;
      if (!pos) return;

      const meters = MAX_SPEED * speedRef.current * mag * dt;
      const dLat = (-dy * meters) / 111139;
      const dLng = (dx * meters) / (111139 * Math.cos((pos.lat * Math.PI) / 180));

      const next = { lat: pos.lat + dLat, lng: pos.lng + dLng };
      posRef.current = next; // update immediately so next frame uses fresh pos
      cbRef.current(next);
    }

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const moveKnob = (rawDx: number, rawDy: number) => {
    const dist = Math.sqrt(rawDx * rawDx + rawDy * rawDy);
    const clamped = Math.min(dist, OUTER_R);
    const norm = dist > 0 ? clamped / OUTER_R : 0;
    vecRef.current = {
      dx: dist > 0 ? (rawDx / dist) * norm : 0,
      dy: dist > 0 ? (rawDy / dist) * norm : 0,
    };
    if (knobRef.current) {
      const kx = dist > 0 ? (rawDx / dist) * clamped : 0;
      const ky = dist > 0 ? (rawDy / dist) * clamped : 0;
      knobRef.current.style.transition = 'none';
      knobRef.current.style.transform = `translate(${kx}px, ${ky}px)`;
    }
  };

  const resetKnob = () => {
    activeRef.current = false;
    lastTimeRef.current = 0;
    vecRef.current = { dx: 0, dy: 0 };
    if (knobRef.current) {
      knobRef.current.style.transition = 'transform 0.18s ease';
      knobRef.current.style.transform = 'translate(0, 0)';
    }
  };

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    activeRef.current = true;
    lastTimeRef.current = 0;
    const rect = e.currentTarget.getBoundingClientRect();
    moveKnob(e.clientX - (rect.left + OUTER_R), e.clientY - (rect.top + OUTER_R));
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    moveKnob(e.clientX - (rect.left + OUTER_R), e.clientY - (rect.top + OUTER_R));
  }, []);

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={resetKnob}
      onPointerCancel={resetKnob}
      className="absolute bottom-14 left-5 z-[2000] w-[104px] h-[104px] rounded-full bg-white/[0.12] border-2 border-white/35 flex items-center justify-center touch-none cursor-grab select-none shadow-lg"
    >
      <div
        ref={knobRef}
        className="w-11 h-11 rounded-full bg-white/45 border-2 border-white/85 pointer-events-none shadow-md"
      />
    </div>
  );
}
