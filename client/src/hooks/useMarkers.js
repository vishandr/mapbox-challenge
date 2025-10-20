// hooks/useMarkers.js
import { useState, useCallback } from 'react';
import {
  fetchMarkers,
  createMarkerApi,
  updateMarkerApi,
  deleteMarkerApi,
} from '../services/api';
import { getColorByScore } from '../utils/score';

export function useMarkers() {
  const [markers, setMarkers] = useState([]);

  const loadMarkers = useCallback(async () => {
    try {
      const data = await fetchMarkers();
      setMarkers(data);
      return data;
    } catch (err) {
      alert('❌ ' + err.message);
      return [];
    }
  }, []);

  const addMarker = useCallback(async (markerData) => {
    try {
      const data = await createMarkerApi(markerData);
      const newMarker = { ...data, color: getColorByScore(markerData.score) };
      setMarkers((prev) => [...prev, newMarker]);
      return newMarker;
    } catch (err) {
      alert('❌ ' + err.message);
      return null;
    }
  }, []);

  const updateMarkerScore = useCallback(async (id, newScore) => {
    try {
      const updated = await updateMarkerApi(id, { score: newScore });
      setMarkers((prev) =>
        prev.map((m) =>
          m.id === updated.id
            ? {
                ...m,
                score: updated.score,
                color: getColorByScore(updated.score),
              }
            : m
        )
      );
      return updated;
    } catch (err) {
      alert('❌ ' + err.message);
      return null;
    }
  }, []);

  const removeMarker = useCallback(async (id) => {
    try {
      await deleteMarkerApi(id);
      setMarkers((prev) => prev.filter((m) => m.id !== id));
      return true;
    } catch (err) {
      alert('❌ ' + err.message);
      return false;
    }
  }, []);

  const moveMarker = useCallback((id, newLng, newLat) => {
    setMarkers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, lng: newLng, lat: newLat } : m))
    );
  }, []);

  return {
    markers,
    loadMarkers,
    addMarker,
    updateMarkerScore,
    removeMarker,
    moveMarker,
    setMarkers,
  };
}
