import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import type { Point } from '../types';

const REVEAL_METERS = 50;

function metersPerPixel(lat: number, zoom: number): number {
  return (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom);
}

interface Props {
  exploredPoints: Point[];
  onMapReady: (map: LeafletMap) => void;
}

export function FogCanvas({ exploredPoints, onMapReady }: Props) {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const exploredRef = useRef(exploredPoints);
  exploredRef.current = exploredPoints;

  useEffect(() => {
    onMapReady(map);
  }, [map, onMapReady]);

  useEffect(() => {
    const container = map.getContainer();
    const parent = container.parentElement;
    if (!parent) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1000';
    canvas.style.pointerEvents = 'none';
    parent.appendChild(canvas);
    canvasRef.current = canvas;

    function resize() {
      canvas.width = parent!.offsetWidth;
      canvas.height = parent!.offsetHeight;
      redraw();
    }

    function redraw() {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0,0,0,0.92)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = 'destination-out';

      const zoom = map.getZoom();
      const center = map.getCenter();
      const mpp = metersPerPixel(center.lat, zoom);
      const radiusPx = REVEAL_METERS / mpp;

      for (const pt of exploredRef.current) {
        const px = map.latLngToContainerPoint([pt.lat, pt.lng]);
        const gradient = ctx.createRadialGradient(px.x, px.y, 0, px.x, px.y, radiusPx);
        gradient.addColorStop(0, 'rgba(0,0,0,1)');
        gradient.addColorStop(0.7, 'rgba(0,0,0,0.9)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(px.x, px.y, radiusPx, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);

    map.on('move zoom moveend zoomend', redraw);

    resize();

    // Expose redraw for point updates
    (canvas as any)._fogRedraw = redraw;

    return () => {
      resizeObserver.disconnect();
      map.off('move zoom moveend zoomend', redraw);
      canvas.remove();
      canvasRef.current = null;
    };
  }, [map]); // eslint-disable-line react-hooks/exhaustive-deps

  // Trigger redraw when points change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && (canvas as any)._fogRedraw) {
      (canvas as any)._fogRedraw();
    }
  }, [exploredPoints]);

  return null;
}
