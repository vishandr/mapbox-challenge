import { useRef, useEffect, useCallback } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import MarkerStats from './components/MarkerStats';
import { useMarkers } from './hooks/useMarkers';
import { useMap } from './hooks/useMap';

function App() {
  const mapContainer = useRef(null);
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  // Use custom hooks
  const {
    markers,
    loadMarkers,
    addMarker,
    updateMarkerScore,
    removeMarker,
    moveMarker,
  } = useMarkers();

  const { map, initializeMap, addMarkerToMap, setupMapClickHandler } = useMap(
    mapContainer,
    MAPBOX_TOKEN,
    markers,
    updateMarkerScore,
    removeMarker,
    moveMarker
  );

  // Handle map click to add new markers
  const handleMapClick = useCallback(
    async ({ lng, lat, score }) => {
      const newMarker = await addMarker({ lng, lat, score });
      if (newMarker) {
        addMarkerToMap(newMarker);
      }
    },
    [addMarker, addMarkerToMap]
  );

  useEffect(() => {
    // Initialize map and load markers
    const initializeApp = async () => {
      initializeMap();
      const data = await loadMarkers();
      if (data.length > 0) {
        data.forEach((markerData) => addMarkerToMap(markerData));
      }
    };

    initializeApp();
  }, [initializeMap, loadMarkers, addMarkerToMap]);

  useEffect(() => {
    // Setup map click handler
    if (map) {
      setupMapClickHandler(handleMapClick);
    }
  }, [map, setupMapClickHandler, handleMapClick]);

  return (
    <>
      <div
        ref={mapContainer}
        style={{
          width: '100vw',
          height: '100vh',
          position: 'relative',
        }}
      />
      <MarkerStats markers={markers} />
    </>
  );
}

export default App;
