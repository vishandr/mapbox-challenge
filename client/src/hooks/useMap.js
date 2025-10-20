// hooks/useMap.js
import { useRef, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import createMarker from '../components/Marker';
import { getColorByScore } from '../utils/score';

export function useMap(
  containerRef,
  token,
  markers,
  onMarkerScoreChange,
  onMarkerDelete,
  onMarkerMove
) {
  const map = useRef(null);

  const initializeMap = useCallback(() => {
    if (map.current || !containerRef.current) return;

    mapboxgl.accessToken = token;
    map.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [30.743, 46.4778],
      zoom: 14,
    });

    return map.current;
  }, [containerRef, token]);

  const addMarkerToMap = useCallback(
    (markerData) => {
      if (!map.current) return null;

      return createMarker(
        map.current,
        markerData,
        onMarkerScoreChange,
        getColorByScore,
        onMarkerDelete,
        onMarkerMove
      );
    },
    [onMarkerScoreChange, onMarkerDelete, onMarkerMove]
  );

  const setupMapClickHandler = useCallback((onMapClick) => {
    if (!map.current) return;

    map.current.on('click', async (e) => {
      if (
        e.originalEvent.target.closest('.mapboxgl-marker') ||
        e.originalEvent.target.closest('.mapboxgl-popup')
      ) {
        return;
      }

      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;
      const score = 0; // default score

      await onMapClick({ lng, lat, score });
    });
  }, []);

  const loadMarkersToMap = useCallback(
    (markersData) => {
      if (!map.current) return;

      markersData.forEach((markerData) => {
        addMarkerToMap(markerData);
      });
    },
    [addMarkerToMap]
  );

  useEffect(() => {
    const mapInstance = initializeMap();
    if (mapInstance && markers.length > 0) {
      loadMarkersToMap(markers);
    }
  }, [initializeMap, loadMarkersToMap, markers]);

  return {
    map: map.current,
    initializeMap,
    addMarkerToMap,
    setupMapClickHandler,
    loadMarkersToMap,
  };
}
