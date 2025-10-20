//client/src/components/MarkerStats.jsx
import { useState } from 'react';
import { summarizeByScore } from '../utils/score';
import { importMarkersApi } from '../services/api';
import ImportMarkersButton from './ImportMarkersButton';
import ExportMarkersButton from './ExportMarkersButton';

export default function MarkerStats({ markers }) {
  const [showList, setShowList] = useState(false);

  // export handled by ExportMarkersButton

  // import markers from json file
  const handleImport = async (data) => {
    try {
      const imported = await importMarkersApi(data);
      alert(`✅ Imported ${imported.message}`);
    } catch (err) {
      alert('❌ ' + err.message);
    }
  };

  const scoreSummary = summarizeByScore(markers);

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
          Markers: <strong>{markers.length}</strong>
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
          {markers.length === 0 && <p style={{ margin: 0 }}>No data</p>}
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
                <ExportMarkersButton markers={markers} />
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
