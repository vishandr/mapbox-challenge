import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './App.css';

function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    if (map.current) return; // карта уже инициализирована

    mapboxgl.accessToken = MAPBOX_TOKEN;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [30.5234, 50.4501], // Киев как стартовая позиция
      zoom: 10,
    });
  }, [MAPBOX_TOKEN]);

  return <div ref={mapContainer} style={{ width: '100vw', height: '100vh' }} />;
}

export default App;
