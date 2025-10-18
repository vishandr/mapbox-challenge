import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

const markers = [];
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
  // console.log('Updating marker with id:', id);
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

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
