// src/components/Marker.jsx
import mapboxgl from 'mapbox-gl';

export default function createMarker(
  map,
  { id, lng, lat, score },
  onScoreChange,
  getColorByScore,
  onDelete,
  onMove
) {
  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const el = document.createElement('div');
  el.style.backgroundColor = getColorByScore(score);
  el.style.width = '20px';
  el.style.height = '20px';
  el.style.borderRadius = '50%';
  el.style.border = '2px solid white';
  el.style.cursor = 'pointer';
  el.style.pointerEvents = 'auto';

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

  const marker = new mapboxgl.Marker({ element: el, draggable: true })
    .setPopup(popup)
    .setLngLat([lng, lat])
    .addTo(map);

  marker.on('dragstart', () => (el.style.opacity = '0.6'));
  marker.on('dragend', () => (el.style.opacity = '1'));

  marker.on('dragend', async () => {
    const { lng, lat } = marker.getLngLat();
    try {
      const res = await fetch(`${BASE_URL}/markers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lng, lat }),
      });
      if (!res.ok) throw new Error('Ошибка при обновлении');
      const updated = await res.json();
      console.log('✅ Маркер перемещён:', updated);
      if (onMove) onMove(id, lng, lat);
    } catch (err) {
      console.error('Ошибка:', err);
      alert('⚠️ Не удалось сохранить новую позицию' + err.message);
    }
  });

  const incBtn = popupContent.querySelector(`#inc-${id}`);
  const delBtn = popupContent.querySelector(`#del-${id}`);

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
