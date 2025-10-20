// services/api.js

const BASE_URL = 'http://localhost:4000';

export async function fetchMarkers() {
  const res = await fetch(`${BASE_URL}/markers`);
  if (!res.ok) throw new Error('Failed to fetch markers');
  return res.json();
}

export async function createMarkerApi({ lng, lat, score }) {
  const res = await fetch(`${BASE_URL}/markers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lng, lat, score }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Server error');
  return data;
}

export async function updateMarkerApi(id, payload) {
  const res = await fetch(`${BASE_URL}/markers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update marker');
  return res.json();
}

export async function deleteMarkerApi(id) {
  const res = await fetch(`${BASE_URL}/markers/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete marker');
}

export async function importMarkersApi(data) {
  const res = await fetch(`${BASE_URL}/markers/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to import markers');
  return res.json();
}
