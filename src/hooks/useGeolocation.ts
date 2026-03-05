import { useState, useEffect, useRef } from 'react';
import { Capacitor, registerPlugin } from '@capacitor/core';
import type { BackgroundGeolocationPlugin, Location, CallbackError } from '@capacitor-community/background-geolocation';
import type { Point } from '../types';

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>('BackgroundGeolocation');

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
    if (Capacitor.isNativePlatform()) {
      let watcherId: string | undefined;

      BackgroundGeolocation.addWatcher(
        {
          backgroundMessage: 'Tracking your location to reveal the map.',
          backgroundTitle: 'Mapa — exploring',
          requestPermissions: true,
          stale: false,
          distanceFilter: 10,
        },
        (location?: Location, error?: CallbackError) => {
          if (error) {
            setState((prev) => ({
              ...prev,
              error: error.code === 'NOT_AUTHORIZED' ? 'Location permission denied' : 'GPS unavailable',
              loading: false,
            }));
            return;
          }
          if (location) {
            const point: Point = { lat: location.latitude, lng: location.longitude };
            setState({ position: point, error: null, loading: false });
            onPositionRef.current(point);
          }
        },
      ).then((id: string) => {
        watcherId = id;
      });

      return () => {
        if (watcherId) BackgroundGeolocation.removeWatcher({ id: watcherId });
      };
    }

    // Browser fallback for development
    if (!navigator.geolocation) {
      setState({ position: null, error: 'Geolocation not supported', loading: false });
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const point: Point = { lat: pos.coords.latitude, lng: pos.coords.longitude };
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
      { enableHighAccuracy: true, maximumAge: 5000 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return state;
}
