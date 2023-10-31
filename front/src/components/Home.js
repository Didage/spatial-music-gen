
import React, { useState, useEffect } from 'react';
import AudioPlayer from 'react-audio-player';
import './Home.css'; // Import your CSS file for styling
import ReactAudioPlayer from "react-audio-player";
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';



function Home() {
  const [selectedAudio, setSelectedAudio] = useState("");
  const [audioFiles, setAudioFiles] = useState([]);
  const [inputPrompt, setInputPrompt] = useState('');

  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');


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

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
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
    <Container className="app-container">
      <h1 className="title">Generate music!</h1>
      <p className="welcome-message">Here you can generate music based on the description of a place you love!</p>
      
      <Form onSubmit={postPrompt}>
            <Form.Group controlId="titleInput">
              <Form.Control
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Put a title to your music:"
              />
            </Form.Group>
            <Form.Group controlId="promptInput">
              <Form.Control
                type="text"
                value={inputPrompt}
                onChange={handleInputPromptChange}
                placeholder="Enter a description:"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
      <select onChange={handleFileSelection}>
        <option value="">Select an audio file</option>
        {audioFiles.map((file, index) => (
          <>
            <option key={index} value={file.audioURL}>
              {file.audio1URL}
            </option>
          </>
        ))}
      </select>
      {selectedAudio && (
        <div>
          <ReactAudioPlayer src={selectedAudio} controls autoPlay />
        </div>
      )}
    </Container>
  );
}

export default Home;
