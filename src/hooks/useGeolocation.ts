import { useState, useEffect, useRef } from 'react';
import type { Point } from '../types';

interface GeolocationState {
  position: Point | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(onPosition: (point: Point) => void) {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: true,
  });
  const onPositionRef = useRef(onPosition);
  onPositionRef.current = onPosition;

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ position: null, error: 'Geolocation not supported', loading: false });
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const point: Point = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setState({ position: point, error: null, loading: false });
        onPositionRef.current(point);
      },
      (err) => {
        setState((prev) => ({
          ...prev,
          error: err.code === 1 ? 'Location permission denied' : 'GPS unavailable',
          loading: false,
        }));
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return state;
}
