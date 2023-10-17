import React, { useState, useEffect } from "react";
import ReactAudioPlayer from "react-audio-player";

function AudioPlayer() {
  const [selectedAudio, setSelectedAudio] = useState("");
  const [audioFiles, setAudioFiles] = useState([]);
  const [inputPrompt, setInputPrompt] = useState('');


  useEffect(() => {
    fetch("http://localhost:8000/generations") 
      .then((response) => response.json())
      .then((data) => setAudioFiles(data));
  }, []);

  const handleFileSelection = (event) => {
    const fileURL = ("http://localhost:3001/" + event.target.value).replace("musicge-", "musicgen").replace("./audios","audios");
    setSelectedAudio(fileURL);
  };

  const handleInputPromptChange = (event) => {
    setInputPrompt(event.target.value);
  };

  const postPrompt = () => {
    fetch('http://localhost:8000/generations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id:5,
            session_name: "I created a new session.",
            prompt: inputPrompt,
            audio1URL: "audios/Gen0-musicgen-outA.wav",
            audio2URL: "audios/Gen0-musicgen-outB.wav",
            audio3URL: "audios/Gen0-musicgen-outC.wav",
            creationDate: "17-10-23" }),
      })
        .then((response) => {
          if (response.ok) {
            alert('Request sent successfully.');
          } else {
            alert('Request failed.');
          }
        });
  };

  return (
    <div>
      <h1>Generate music!</h1>
      <input
        type="text"
        placeholder="Enter a description:"
        value={inputPrompt}
        onChange={handleInputPromptChange}
      />
      <button onClick={postPrompt}>Send POST Request</button>
      <select onChange={handleFileSelection}>
        <option value="">Select an audio file</option>
        {audioFiles.map((file, index) => (
          <>
            <option key={index} value={file.audio1URL}>
              {file.audio1URL}
            </option>
            <option key={index} value={file.audio2URL}>
              {file.audio2URL}
            </option>
            <option key={index} value={file.audio3URL}>
              {file.audio3URL}
            </option>
          </>
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
