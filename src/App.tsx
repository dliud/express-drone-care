import { Button, Typography } from 'antd';
import React, { useState } from 'react';
import './App.css';
import { DragAndDrop } from './components/DragAndDrop';
import axios from 'axios';

function handleClick() {
  axios.get(`http://localhost:3001/test`)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  })
}



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Typography.Title >
          Express Drone Care
        </Typography.Title>
        
        {
          isFileUploaded ? 
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography.Text>
              Thank you.  A drone will be on its way shortly with the 
              following medications: {prescription}.
            </Typography.Text>
            <br/>
            <Button onClick={() => {
              setIsFileUploaded(false)
              setPrescription('')
            }}> Upload another file </Button>
          </div>
           : 
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography.Paragraph style={{'fontSize': 20}}>
              Upload your patient log, and we'll deliver you the 
              care you need, right to your door.
            </Typography.Paragraph>
            <DragAndDrop 
              setIsFileUploaded={setIsFileUploaded} 
              setPrescription={setPrescription}
            />
          </div>
        }
        
      </header>
      <button onClick={handleClick}>server test</button>
    </div>
  );
}

export default App;
