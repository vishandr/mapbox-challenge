// src/components/Marker.jsx
import mapboxgl from 'mapbox-gl';

export default function createMarker(
  map,
  { id, lng, lat, score },
  onScoreChange,
  getColorByScore,
  onDelete
) {
  const el = document.createElement('div');
  el.style.backgroundColor = getColorByScore(score);
  el.style.width = '20px';
  el.style.height = '20px';
  el.style.borderRadius = '50%';
  el.style.border = '2px solid white';
  el.style.cursor = 'pointer';

  const popup = new mapboxgl.Popup({ offset: 25 });

  const popupContent = document.createElement('div');
  popupContent.innerHTML = `
    <div style="min-width: 100px; font-size: 14px;">
      <p class="score-text">Score: <strong>${score}</strong></p>
      <button id="inc-${id}" style="margin-right: 6px;">Изменить</button>
      <button id="del-${id}" style="color: red;">Удалить</button>
    </div>
  `;

  popup.setDOMContent(popupContent);

  const marker = new mapboxgl.Marker(el)
    .setPopup(popup)
    .setLngLat([lng, lat])
    .addTo(map);

  const incBtn = popupContent.querySelector(`#inc-${id}`);
  const delBtn = popupContent.querySelector(`#del-${id}`);
  const scoreText = popupContent.querySelector('.score-text');

  el.addEventListener('mousedown', (e) => e.stopPropagation());
  popupContent.addEventListener('click', (e) => e.stopPropagation());

  // ⚙️ Обработчики внутри popup
  incBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const newScore = parseInt(prompt('Введите новый score (0–5):'), 10);
    if (isNaN(newScore) || newScore < 0 || newScore > 5) {
      alert('⚠️ Введите число от 0 до 5');
      return;
    }
    onScoreChange(id, newScore);
    el.style.backgroundColor = getColorByScore(newScore);
    popupContent.querySelector(
      'p'
    ).innerHTML = `Score: <strong>${newScore}</strong>`;
  });

  delBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (confirm('Удалить этот маркер?')) {
      onDelete(id);
      marker.remove();
    }
  });

  return marker;
}
