import { Typography } from 'antd';
import React from 'react';
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
        <Typography.Paragraph style={{'fontSize': 20}}>
          Upload your patient log, and we'll deliver you the 
          care you need, right to your door.
        </Typography.Paragraph>
          
        <DragAndDrop/>
      </header>
      <button onClick={handleClick}>server test</button>
    </div>
  );
}

export default App;
