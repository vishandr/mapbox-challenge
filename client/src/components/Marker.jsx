// src/components/Marker.jsx
import mapboxgl from 'mapbox-gl';

export default function createMarker(
  map,
  { id, lng, lat, score },
  onScoreChange,
  getColorByScore
) {
  const el = document.createElement('div');
  el.style.backgroundColor = getColorByScore(score);
  el.style.width = '20px';
  el.style.height = '20px';
  el.style.borderRadius = '50%';
  el.style.border = '2px solid white';
  el.style.cursor = 'pointer';

  // При клике на маркер — меняем score
  el.addEventListener('click', (e) => {
    e.stopPropagation(); // чтобы не сработал клик по карте!
    const newScore = parseInt(prompt('Введите новый score (0–5):', 1));
    if (isNaN(newScore) || newScore < 0 || newScore > 5) {
      alert('⚠️ Введите число от 0 до 5');
      return;
    }
    onScoreChange(id, newScore);
    el.style.backgroundColor = getColorByScore(newScore);
  });

  const marker = new mapboxgl.Marker(el).setLngLat([lng, lat]).addTo(map);
  return marker;
}
