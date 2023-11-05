import React, { useState, useEffect } from "react";
import AudioPlayer from "react-audio-player";
import "./Home.css"; // Import your CSS file for styling
import ReactAudioPlayer from "react-audio-player";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { v4 as uuidv4 } from "uuid";

function Home() {
  const [selectedAudio, setSelectedAudio] = useState("");
  const [sessionID, setSessionID] = useState("");
  const [inputPrompt, setInputPrompt] = useState("");
  const [dataReceived, setDataReceived] = useState(false);
  const [title, setTitle] = useState("");
  // const [inputSessionID, setInputSessionID] = useState("");
  const [fetchingData, setFetchingData] = useState(false);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     fetchGeneration();
  //   }, 5000);

  //   return () => clearInterval(intervalId);
  // }, []);

  function checkForGeneratedAudio() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("Checking for created audio");
      }, 360000);
    });
  }

  // async function fetchGenerationByID() {
  //   try {
  //     if (sessionID) {
  //       var response = await fetch("http://localhost:8000/generations/" + sessionID, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         }});
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok.');
  //       }
  //       var data = await response.json();
  //       setSelectedAudio(data.audioURL);
  //       setDataReceived(true);
  //       console.log("Data fetched: " + data.audioURL);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
   
  // }

  // const fetchGeneration = (flagSuccesfullGet) => {
  //   console.log(sessionID);
  //   if (sessionID) {
  //     fetch("http://localhost:8000/generations/" + sessionID, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //       .then((response) => {
  //         if (!response.ok) {
  //           flagSuccesfullGet = false;
  //         } else {
  //           flagSuccesfullGet = true;
  //           setDataReceived(true);
  //           var data = response.json();
  //           setSelectedAudio(response.audioURL);
  //           console.log(response.audioURL);
  //         }
  //       })
  //       // .catch((error) => {
  //       //   console.log("Error fetching generation");
  //       // });
  //   }
  // };

  const handleInputPromptChange = (event) => {
    setInputPrompt(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleSessionIDChange = (event) => {
    setSessionID(event.target.value);
  };

  async function handleSessionSubmit() {
    try {
      if (sessionID) {
        console.log("About to fetch");
        var response = await fetch("http://localhost:8000/generations/" + sessionID, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }});
          console.log("First fetch OK");
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        console.log("response OK");
        var data = await response.json();
        console.log(...data)
        setSelectedAudio(data.audioURL);
        setDataReceived(true);
      } else {
        alert("Please provide an ID")
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    console.log("END of the session submit");
  }

  const postPrompt = () => {
    console.log("Entré al POST");
    setDataReceived(false);
    const sessionId = uuidv4();
    fetch("http://localhost:8000/generations/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_name: sessionID,
        title: title,
        prompt: inputPrompt,
      }),
    })
      .then(() => {
        setSessionID(sessionID);
      })
      .then(() => {
        setFetchingData(true);
        checkForGeneratedAudio().then(() => {
          var successFlag = false;
          do {
            // fetchGeneration(successFlag);
          } while (!successFlag);
          setDataReceived(true);
          setFetchingData(false);
        });
      });
  };

  return (
    <Container className="app-container">
      <h1 className="title">Generate music!</h1>
      <p className="welcome-message">
        Here you can generate music based on the description of a place you
        love!
      </p>
      {(!fetchingData || dataReceived) && (
        <>
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
                onChange={handleInputPromptChange}
                placeholder="Enter a description:"
              />
            </Form.Group>
            <br></br>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>

          <br></br>
          <h3>Do you already have a session ID?</h3>
          <Form onSubmit={handleSessionSubmit}>
            <Form.Group controlId="sessionInput">
              <Form.Control
                type="text"
                onChange={handleSessionIDChange}
                placeholder="Enter Session ID to fetch saved entity:"
              />
            </Form.Group>
            <br></br>

            <Button variant="primary" type="submit">
              Get me my old music!
            </Button>
          </Form>
        </>
      )}
      {fetchingData &&
        <h1>Generating your audio! please be patient</h1>
      }
      {dataReceived && (
        <div>
          <br></br>
          <ReactAudioPlayer
            src={"http://localhost:3001/" + selectedAudio}
            controls
            autoPlay
          />
        </div>
      )}
    </Container>
  );
}

export default Home;
