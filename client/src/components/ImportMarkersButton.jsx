// components/ImportMarkersButton.jsx
import React from 'react';

const ImportMarkersButton = ({ onImport }) => {
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (Array.isArray(data)) {
        onImport(data);
      } else {
        alert('Invalid JSON format');
      }
    } catch (error) {
      console.error('Error parsing JSON file:' + error.message);
      alert('Error parsing JSON file');
    }
    e.target.value = null;
  };

  return (
    <label htmlFor='import-markers'>
      Import Markers
      <input
        type='file'
        id='import-markers'
        accept='.json'
        onChange={handleImport}
      />
    </label>
  );
};

export default ImportMarkersButton;
