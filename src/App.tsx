import { useState, useCallback, useRef } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { useExploredPoints } from './hooks/useExploredPoints';
import { useUserProfile } from './hooks/useUserProfile';
import { useExplorerStats } from './hooks/useExplorerStats';
import { MapView } from './components/MapView';
import { SimPanel } from './components/SimPanel';
import { BottomNav } from './components/BottomNav';
import { DiscoveryLogScreen } from './components/screens/DiscoveryLogScreen';
import { CommunityScreen } from './components/screens/CommunityScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { EditProfileScreen } from './components/screens/EditProfileScreen';
import type { Point, Screen } from './types';

export default function App() {
  const { points, addPoint, clearPoints } = useExploredPoints();
  const { profile, updateProfile } = useUserProfile();
  const stats = useExplorerStats(points);

  const [screen, setScreen] = useState<Screen>('map');
  const visitedRef = useRef<Set<Screen>>(new Set(['map']));
  const navigate = (s: Screen) => {
    visitedRef.current.add(s);
    setScreen(s);
  };

  const [simActive, setSimActive] = useState(false);
  const [simPosition, setSimPosition] = useState<Point | null>(null);

  const geoState = useGeolocation(useCallback((point: Point) => {
    if (!simActive) addPoint(point.lat, point.lng);
  }, [simActive, addPoint]));

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
    <div className="flex flex-col w-screen h-screen bg-[#060e20] overflow-hidden">
      <div className="relative flex-1 overflow-hidden">
        <MapView
          exploredPoints={points}
          position={effectivePosition}
          onClear={clearPoints}
          statusText={statusText}
          onMapClick={simActive ? handleSimPosition : undefined}
          isActive={screen === 'map'}
          navOffset
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

        {visitedRef.current.has('log') && (
          <DiscoveryLogScreen
            isActive={screen === 'log'}
            profile={profile}
            stats={stats}
          />
        )}
        {visitedRef.current.has('community') && (
          <CommunityScreen isActive={screen === 'community'} />
        )}
        {visitedRef.current.has('profile') && (
          <ProfileScreen
            isActive={screen === 'profile'}
            profile={profile}
            stats={stats}
            points={points}
            onEditProfile={() => navigate('edit-profile')}
          />
        )}
        {visitedRef.current.has('edit-profile') && (
          <EditProfileScreen
            isActive={screen === 'edit-profile'}
            profile={profile}
            onSave={(partial) => { updateProfile(partial); navigate('profile'); }}
            onBack={() => navigate('profile')}
          />
        )}
      </div>

      {screen !== 'edit-profile' && (
        <BottomNav screen={screen} onNavigate={navigate} />
      )}
    </div>
  );
}
