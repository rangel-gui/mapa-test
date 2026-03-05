import { CircleMarker } from 'react-leaflet';
import type { Point } from '../types';

interface Props {
  position: Point;
}

export function UserMarker({ position }: Props) {
  return (
    <CircleMarker
      center={[position.lat, position.lng]}
      radius={8}
      pathOptions={{
        color: '#4A90E2',
        fillColor: '#4A90E2',
        fillOpacity: 0.9,
        weight: 3,
      }}
    />
  );
}
