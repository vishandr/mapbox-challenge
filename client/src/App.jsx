import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

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

  useEffect(() => {
    if (map.current) return; // карта уже инициализирована

    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [30.5234, 50.4501], // Киев как стартовая позиция
      zoom: 10,
    });

    // слушаем клики по карте
    map.current.on('click', async (e) => {
      const score = Math.floor(Math.random() * 6); // случайный от 0 до 5

      try {
        const res = await fetch('http://localhost:4000/markers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lng: e.lngLat.lng,
            lat: e.lngLat.lat,
            score,
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Server error');
        // if (!data.success) throw new Error(data.message);

        const color = getColorByScore(score);

        // создаем HTML-элемент для кастомного маркера
        const el = document.createElement('div');
        el.style.backgroundColor = color;
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';

        // создаем маркер
        const marker = new mapboxgl.Marker(el)
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(map.current);

        setMarkers((prev) => [...prev, { id: data.id, marker, score }]);
      } catch (err) {
        alert('❌ Не удалось создать маркер: ' + err.message);
      }
    });
  }, [MAPBOX_TOKEN]);

  return <div ref={mapContainer} style={{ width: '100vw', height: '100vh' }} />;
}

export default App;
