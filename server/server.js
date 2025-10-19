import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(process.cwd(), 'server', 'data', 'markers.json');

let markers = [];
try {
  const data = fs.readFileSync(DATA_FILE, 'utf-8');
  markers = JSON.parse(data);
  console.log(`✅ Loaded ${markers.length} markers from file`);
} catch (err) {
  console.log('⚠️ No existing data file, starting fresh');
}

let createCounter = 0;

// тестовый endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Server is running 🚀' });
});

// получить все маркеры
app.get('/markers', (req, res) => res.json(markers));

// создать маркер с симуляцией ошибки
app.post('/markers', (req, res) => {
  createCounter++;
  if (createCounter % 3 === 0) {
    return res.status(500).json({ error: 'Simulated failure' });
  }
  const { lat, lng, score } = req.body;
  const marker = {
    id: uuidv4(),
    lat,
    lng,
    score: score ?? 0,
    createdAt: new Date().toISOString(),
  };
  markers.push(marker);
  res.status(201).json(marker);
});

// обновить
app.put('/markers/:id', (req, res) => {
  const id = req.params.id;
  const idx = markers.findIndex((m) => m.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  Object.assign(markers[idx], req.body);
  res.json(markers[idx]);
});

// удалить
app.delete('/markers/:id', (req, res) => {
  const id = req.params.id;
  const idx = markers.findIndex((m) => m.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  markers.splice(idx, 1);
  res.status(204).end();
});

// импорт маркеров (заменяет все существующие)
app.post('/markers/import', (req, res) => {
  const imported = req.body;
  if (!Array.isArray(imported)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }
  markers = imported;
  saveMarkers();
  res.json({ message: `✅ Imported ${markers.length} markers` });
});

// Утилита для сохранения в файл
function saveMarkers() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(markers, null, 2), 'utf-8');
}

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
