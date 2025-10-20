// components/ExportMarkersButton.jsx
import React from 'react';

const ExportMarkersButton = ({ markers }) => {
  const exportMarkers = () => {
    const markersJson = JSON.stringify(markers, null, 2);
    const blob = new Blob([markersJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markers.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
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
  );
};

export default ExportMarkersButton;
