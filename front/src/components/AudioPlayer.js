import React, { useState, useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';

function AudioPlayer() {
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [audioFiles, setAudioFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');

  // Fetch the list of audio files from the server
  useEffect(() => {
    fetch('localhost:8000/generations') // Replace with your server's endpoint
      .then((response) => response.json())
      .then((data) => setAudioFiles(data));
  }, []);

  const handleFileSelection = (event) => {
    const fileURL = event.target.value;
    setSelectedAudio(fileURL);
  };

  return (
    <div>
      <h1>Server Audio Player</h1>
      <select onChange={handleFileSelection}>
        <option value="">Select an audio file</option>
        {audioFiles.map((file, index) => (
          <option key={index} value={file.audio1URL}>
            {file.name}
          </option>
        ))}
        {audioFiles.map((file, index) => (
          <option key={index} value={file.audio2URL}>
            {file.name}
          </option>
        ))}
        {audioFiles.map((file, index) => (
          <option key={index} value={file.audio3URL}>
            {file.name}
          </option>
        ))}
      </select>
      {selectedAudio && (
        <div>
          <ReactAudioPlayer src={selectedAudio} controls autoPlay />
        </div>
      )}
    </div>
  );
}

export default AudioPlayer;
