import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import createMarker from './components/Marker';
// import { createRoot } from 'react-dom/client';

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [markers, setMarkers] = useState([]);
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  const getColorByScore = (score) => {
    switch (score) {
      case 0:
        return 'black';
      case 1:
        return 'gray';
      case 2:
        return 'red';
      case 3:
        return 'orange';
      case 4:
        return 'lime';
      case 5:
        return 'green';
      default:
        return 'blue';
    }
  };

  // Изменение score
  const handleMarkerScoreChange = async (id, newScore) => {
    try {
      const res = await fetch(`http://localhost:4000/markers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: newScore }),
      });

      if (!res.ok) throw new Error('Ошибка при обновлении');

      const updated = await res.json();

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
    } catch (err) {
      alert('❌ ' + err.message);
    }
  };

  useEffect(() => {
    if (map.current) return; // карта уже инициализирована

    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [30.5234, 50.4501], // Киев как стартовая позиция
      zoom: 10,
    });

    // загрузим маркеры с сервера
    fetch('http://localhost:4000/markers')
      .then((res) => res.json())
      .then((data) => {
        setMarkers(data);
        data.forEach((m) =>
          createMarker(map.current, m, handleMarkerScoreChange, getColorByScore)
        );
      });

    // добавление нового маркера по клику
    map.current.on('click', async (e) => {
      const score = 0; // по умолчанию = 0
      // const score = Math.floor(Math.random() * 6); // случайный от 0 до 5
      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;

      try {
        const res = await fetch('http://localhost:4000/markers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lng, lat, score }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Server error');

        // создаем маркер
        const markerData = { ...data, color: getColorByScore(score) };
        createMarker(
          map.current,
          markerData,
          handleMarkerScoreChange,
          getColorByScore
        );
        setMarkers((prev) => [...prev, markerData]);
      } catch (err) {
        alert('❌ ' + err.message);
      }
    });
  }, [MAPBOX_TOKEN]);

  return <div ref={mapContainer} style={{ width: '100vw', height: '100vh' }} />;
}

export default App;
