import { useRef, useCallback, useEffect, type ReactNode } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import { FogCanvas } from './FogCanvas';
import { UserMarker } from './UserMarker';
import type { Point } from '../types';
import 'leaflet/dist/leaflet.css';

interface Props {
  exploredPoints: Point[];
  position: Point | null;
  onClear: () => void;
  statusText: string;
  onMapClick?: (point: Point) => void;
  children?: ReactNode;
}

function MapClickHandler({ onClick }: { onClick: (point: Point) => void }) {
  const map = useMapEvents({
    click(e) {
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  useEffect(() => {
    map.getContainer().style.cursor = 'crosshair';
    return () => { map.getContainer().style.cursor = ''; };
  }, [map]);

  return null;
}

export function MapView({
  exploredPoints,
  position,
  onClear,
  statusText,
  onMapClick,
  children,
}: Props) {
  const mapRef = useRef<LeafletMap | null>(null);
  const hasFlewRef = useRef(false);

  const handleMapReady = useCallback((map: LeafletMap) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!position || !mapRef.current) return;
    if (!hasFlewRef.current) {
      hasFlewRef.current = true;
      mapRef.current.flyTo([position.lat, position.lng], 17, { duration: 1.5 });
    } else {
      mapRef.current.setView([position.lat, position.lng], mapRef.current.getZoom(), { animate: false });
    }
  }, [position]);

  return (
    <div className="relative w-screen h-screen">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {position && <UserMarker position={position} />}
        <FogCanvas exploredPoints={exploredPoints} onMapReady={handleMapReady} />
        {onMapClick && <MapClickHandler onClick={onMapClick} />}
      </MapContainer>

      {/* Status bar */}
      <div
        className={`
          absolute bottom-5 left-1/2 -translate-x-1/2 z-[2000]
          text-white px-4 py-1.5 rounded-full text-[13px]
          pointer-events-none whitespace-nowrap transition-colors duration-200
          ${onMapClick ? 'bg-green-900/85' : 'bg-black/75'}
        `}
      >
        {statusText}
        {position && (
          <span className="ml-2 opacity-60">
            ({exploredPoints.length} pts)
          </span>
        )}
      </div>

      {/* Reset button */}
      <button
        onClick={onClear}
        className="absolute top-4 right-4 z-[2000] bg-black/70 hover:bg-black/90 text-white border border-white/30 rounded-lg px-3.5 py-1.5 cursor-pointer text-[13px] transition-colors duration-150"
      >
        Reset fog
      </button>

      {children}
    </div>
  );
}
