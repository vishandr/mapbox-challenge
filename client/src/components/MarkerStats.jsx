//client/src/components/MarkerStats.jsx
import { useState } from 'react';
import ImportMarkersButton from './ImportMarkersButton';

export default function MarkerStats({ markers }) {
  const [showList, setShowList] = useState(false);

  //export markers to json file
  const exportMarkers = () => {
    const markersJson = JSON.stringify(markers, null, 2);
    // fs.writeFileSync('markers.json', markersJson);
    const blob = new Blob([markersJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markers.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // import markers from json file
  const handleImport = async (data) => {
    try {
      const res = await fetch('http://localhost:4000/markers/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Ошибка при импорте');

      const imported = await res.json();
      alert(`✅ Импортировано ${imported.message}`);
    } catch (err) {
      alert('❌ ' + err.message);
    }
  };

  // Calculate score counts
  const scoreCounts = markers.reduce((acc, marker) => {
    const score = marker.score;
    acc[score] = (acc[score] || 0) + 1;
    return acc;
  }, {});

  // Color mapping for scores
  const scoreColors = {
    0: 'black',
    1: 'gray',
    2: 'red',
    3: 'orange',
    4: 'lime',
    5: 'green',
  };

  // Get all possible scores (0-5) and their counts
  const scoreSummary = [];
  for (let i = 5; i >= 0; i--) {
    scoreSummary.push({
      score: i,
      count: scoreCounts[i] || 0,
      label:
        i === 5
          ? 'Five'
          : i === 4
          ? 'Four'
          : i === 3
          ? 'Three'
          : i === 2
          ? 'Two'
          : i === 1
          ? 'One'
          : 'Zero',
      color: scoreColors[i],
    });
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: 30,
        right: 40,
        background: 'rgba(255,255,255,0.95)',
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '14px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        minWidth: '140px',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setShowList((s) => !s)}
      >
        <span>
          Маркеров: <strong>{markers.length}</strong>
        </span>
        <span style={{ fontSize: '18px' }}>{showList ? '▲' : '▼'}</span>
      </div>

      {showList && (
        <div
          style={{
            marginTop: '8px',
            maxHeight: '180px',
            overflowY: 'auto',
            borderTop: '1px solid #ddd',
            paddingTop: '6px',
          }}
        >
          {markers.length === 0 && <p style={{ margin: 0 }}>Нет данных</p>}
          {markers.length > 0 && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '4px 0',
                  borderBottom: '1px solid #ddd',
                  fontWeight: 'bold',
                }}
              >
                <span>Total:</span>
                <span>{markers.length}</span>
              </div>
              <div>
                <button
                  onClick={exportMarkers}
                  style={{
                    marginTop: '6px',
                    padding: '4px 10px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #ddd',
                    borderRadius: '5px',
                  }}
                >
                  💾 Export JSON
                </button>
                <br></br>
                <ImportMarkersButton onImport={handleImport} />
              </div>
              {scoreSummary.map(({ score, count, label, color }) => (
                <div
                  key={score}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '2px 0',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <span>
                    <span style={{ color }}>●</span> {label}:
                  </span>
                  <span>{count}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
