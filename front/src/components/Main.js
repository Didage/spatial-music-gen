import React, { useState, useEffect } from "react";
import AudioPlayer from "react-audio-player";
import "./Home.css"; // Import your CSS file for styling
import ReactAudioPlayer from "react-audio-player";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { v4 as uuidv4 } from "uuid";

function Main() {

    const [data, setData] = useState([]);
    const [genData, setGenData] = useState([]);
    const [sessionID, setSessionID] = useState("");
    const [generationID, setGenerationID] = useState("FAKE_ID");

    const [selectedAudio, setSelectedAudio] = useState("");
    const [title, setTitle] = useState("");
    const [inputPrompt, setInputPrompt] = useState("");

    const [postSubmitted, setPostSubmitted] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [finishedGenerating, setFinishedGenerating] = useState(false);
    const [loadingSession, setLoadingSession] = useState(true);
    const [requestMade, setRequestMade] = useState(false);

    const getUrl = "http://localhost:8000/generations/";

    // For the session fetching
    useEffect(()=>{
        if(requestMade){
            fetch(getUrl+sessionID)
            .then((response)=>{return response.json();})
            .then((json)=>{
                setData(json)
                setSelectedAudio(json.audioURL); 
                setLoadingSession(false);
                console.log("Data fetched: " + json.audioURL);
            })
            .catch((error)=>{console.log(error);})
            .finally(()=>{setRequestMade(false);})
        }
    },[requestMade]);

    // For the generation fetching
    useEffect(()=>{
        if(!isGenerating&&false) {
            const intervalCheck = () => {
                var success = false;
                if(isGenerating||true) {
                    console.log("IM TRYING!");
                    fetch(getUrl+generationID)
                    .then((response)=>{
                        if(response.ok){
                            success = true;
                        };
                    return response.json();})
                    .then((json)=>{
                        console.log(success);
                        if(success) {
                            setGenData(json)
                            setSelectedAudio(json.audioURL); 
                            setIsGenerating(false);
                            setFinishedGenerating(true);
                            console.log("Data fetched: " + json.audioURL);
                        }
                    })
                    .catch((error)=>{console.log("Not ready yet" + error)})
                    .finally(()=>{})
                }
            };
        
            // Run the function at specific time intervals (e.g., every 5 seconds)
            const intervalId = setInterval(intervalCheck, 5000); // 5000 milliseconds = 5 seconds
        
            // Clean up the interval when the component unmounts or when the effect is re-run
            return () => clearInterval(intervalId);
        }
    }, []);
  
    const handleSessionIDChange = (event) => {
        setSessionID(event.target.value);
    };

    const handleSessionSubmit = (event) => {
        event.preventDefault();
        setRequestMade(true);
    };

    const handleInputPromptChange = (event) => {
        setInputPrompt(event.target.value);
      };
    
      const handleTitleChange = (event) => {
        setTitle(event.target.value);
      };

    const postPrompt = (event) => {
        event.preventDefault();

        const newGenerationId = uuidv4();
        var success = false;

        fetch("http://localhost:8000/generations/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            session_name: newGenerationId,
            title: title,
            prompt: inputPrompt,
          }),
        }).then(response => {
            if(response.ok){
                success = true;
            };
            if (!response.ok) {
              throw new Error('Server error: ' + response.status);
            }
            return response.json();
          })
          .then(data => {
            if(success) {
                setGenData(data)
                setSelectedAudio(data.audioURL); 
                setIsGenerating(false);
                setFinishedGenerating(true);
                console.log("Data fetched: " + data.audioURL);
            }
          })
          .catch((error)=>{console.log(error)});
        //   .then(() => {
        //     // setIsGenerating(true);
        //     // setGenerationID(newGenerationId);
        //     // console.log("Posted!");
        //     // setPostSubmitted(true);
        //   })
        //   .then(() => {
        //     // setFetchingData(true);
        //     // checkForGeneratedAudio().then(() => {
        //     //   var successFlag = false;
        //     //   do {
        //     //     // fetchGeneration(successFlag);
        //     //   } while (!successFlag);
        //     //   setDataReceived(true);
        //     //   setFetchingData(false);
        //     });
        setIsGenerating(true);
        setGenerationID(newGenerationId);
        console.log("Posted!");
        setPostSubmitted(true);
      };


  return (
    <Container className="app-container">
      <h1 className="title">Generate music!</h1>
      <p className="welcome-message">
        Here you can generate music based on the description of a place you
        love!
      </p>
      {!postSubmitted &&
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
              Generate!
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
        }

      {(postSubmitted&&isGenerating)&&
      <>
        <h3>Generating...</h3>
        {/* <ActivityIndicator size="large"/> */}
        </>
      }
      {
        finishedGenerating &&
        (
        <div>
          <br></br>
          <h4>Your prompt:</h4>
          <p>{genData.prompt}</p>
          <h4>Your Session ID:</h4>
          <p>{genData.session_name}</p>
          <ReactAudioPlayer
            src={"http://localhost:3001/" + selectedAudio}
            controls
            autoPlay
          />
        </div>
      )}
      {(loadingSession && !postSubmitted) && <h3>No session loaded</h3>}
      {
        (!loadingSession && !postSubmitted) &&
        (
        <div>
          <br></br>
          <h4>Your prompt:</h4>
          <p>{data.prompt}</p>
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

export default Main;
