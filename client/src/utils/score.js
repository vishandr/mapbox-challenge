// utils/score.js

export const scoreColors = {
  0: 'black',
  1: 'gray',
  2: 'red',
  3: 'orange',
  4: 'lime',
  5: 'green',
};

export const scoreLabels = {
  0: 'Zero',
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
};

export function getColorByScore(score) {
  return scoreColors[score] ?? 'blue';
}

export function summarizeByScore(markers) {
  const counts = markers.reduce((acc, m) => {
    const s = m.score ?? 0;
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const summary = [];
  for (let i = 5; i >= 0; i--) {
    summary.push({
      score: i,
      count: counts[i] || 0,
      label: scoreLabels[i],
      color: scoreColors[i],
    });
  }
  return summary;
}
