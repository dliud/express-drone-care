import { Typography } from 'antd';
import React from 'react';
import './App.css';
import { DragAndDrop } from './components/DragAndDrop';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Typography.Paragraph style={{'fontSize': 20}}>
          Upload your patient log file, and we'll deliver you the 
          care you need, right to your door.
        </Typography.Paragraph>
          
        <DragAndDrop/>
      </header>
    </div>
  );
}

export default App;
