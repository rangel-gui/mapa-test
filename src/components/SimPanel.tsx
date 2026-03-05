import { useState } from 'react';
import { Joystick } from './Joystick';
import type { Point } from '../types';

const SPEEDS = [
  { label: 'Walk', value: 1 },
  { label: 'Run',  value: 4 },
  { label: 'Bike', value: 10 },
  { label: 'Car',  value: 30 },
];

interface Props {
  active: boolean;
  position: Point | null;
  onToggle: () => void;
  onPosition: (point: Point) => void;
}

export function SimPanel({ active, position, onToggle, onPosition }: Props) {
  const [speed, setSpeed] = useState(1);

  return (
    <>
      <button
        onClick={onToggle}
        className={`
          absolute top-4 right-[110px] z-[2000]
          text-white border rounded-lg px-3.5 py-1.5 cursor-pointer text-[13px]
          transition-colors duration-200
          ${active
            ? 'bg-green-700/85 border-green-400/50'
            : 'bg-black/70 border-white/30 hover:bg-black/90'}
        `}
      >
        {active ? 'Sim ON' : 'Sim GPS'}
      </button>

      {active && (
        <>
          <Joystick simPosition={position} onPositionChange={onPosition} speed={speed} />
          <div className="absolute bottom-14 left-[132px] z-[2000] flex flex-col gap-1.5 justify-center h-[104px]">
            {SPEEDS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setSpeed(value)}
                className={`
                  text-white border rounded-md px-2.5 py-1 cursor-pointer text-xs
                  whitespace-nowrap transition-colors duration-150
                  ${speed === value
                    ? 'bg-green-700/85 border-green-400/50'
                    : 'bg-black/65 border-white/25 hover:bg-black/85'}
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
