import { useState, useCallback } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { useExploredPoints } from './hooks/useExploredPoints';
import { MapView } from './components/MapView';
import { SimPanel } from './components/SimPanel';
import type { Point } from './types';

export default function App() {
  const { points, addPoint, clearPoints } = useExploredPoints();

  const [simActive, setSimActive] = useState(false);
  const [simPosition, setSimPosition] = useState<Point | null>(null);

  // Real GPS — only records points when sim is off
  const geoState = useGeolocation(useCallback((point: Point) => {
    if (!simActive) addPoint(point.lat, point.lng);
  }, [simActive, addPoint]));

  // Shared handler for both map-click sim and joystick sim
  const handleSimPosition = useCallback((point: Point) => {
    setSimPosition(point);
    addPoint(point.lat, point.lng);
  }, [addPoint]);

  const effectivePosition = simActive ? simPosition : geoState.position;

  const statusText = geoState.loading && !simActive
    ? 'Acquiring GPS...'
    : geoState.error && !simActive
    ? geoState.error
    : simActive
    ? effectivePosition
      ? 'Sim — click map or use joystick'
      : 'Sim — click map to place yourself'
    : effectivePosition
    ? 'Exploring...'
    : 'Waiting for location';

  return (
    <MapView
      exploredPoints={points}
      position={effectivePosition}
      onClear={clearPoints}
      statusText={statusText}
      onMapClick={simActive ? handleSimPosition : undefined}
    >
      {import.meta.env.DEV && (
        <SimPanel
          active={simActive}
          position={effectivePosition}
          onToggle={() => setSimActive((v) => !v)}
          onPosition={handleSimPosition}
        />
      )}
    </MapView>
  );
}
