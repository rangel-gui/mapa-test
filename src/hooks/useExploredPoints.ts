import { useState, useCallback } from 'react';
import type { Point } from '../types';
import { haversineDistance } from '../utils/distance';

const STORAGE_KEY = 'fog-explored-points';
const MIN_DISTANCE_M = 10;

function loadPoints(): Point[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Point[];
  } catch {
    return [];
  }
}

function savePoints(points: Point[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(points));
}

export function useExploredPoints() {
  const [points, setPoints] = useState<Point[]>(loadPoints);

  const addPoint = useCallback((lat: number, lng: number) => {
    setPoints((prev) => {
      const newPoint: Point = { lat, lng };
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        if (haversineDistance(last, newPoint) < MIN_DISTANCE_M) return prev;
      }
      const next = [...prev, newPoint];
      savePoints(next);
      return next;
    });
  }, []);

  const clearPoints = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPoints([]);
  }, []);

  return { points, addPoint, clearPoints };
}
