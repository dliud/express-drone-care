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

function getCurrentDate(separator=''){

  let newDate = new Date()
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  
  return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
}


function App() {
  
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [prescriptions, setPrescriptions] = useState('');
  const [tests, setTests] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientAddress, setPatientAddress] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        <Typography.Title >
          Express Drone Care
        </Typography.Title>
        
        {
          isFileUploaded ? 
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
            <Typography.Title level={2}>
              Thank you! Your order is being fulfilled.
            </Typography.Title>
            <Typography.Text>
              <strong>Placed on: </strong> Saturday, Feb 18, 2023 at 9:30 PM
            </Typography.Text>
            <Typography.Title level={4}>
              Your Drone
            </Typography.Title>
            <Typography.Text>
              Dave
            </Typography.Text>
            <Typography.Title level={4}>
              Delivery details
            </Typography.Title>
            <Typography.Text>
            <strong> Patient Name: </strong> {patientName}
            </Typography.Text>
            <Typography.Text>
            <strong> Address: </strong> {patientAddress}
            </Typography.Text>
            <Typography.Text>
              <strong> Prescriptions: </strong> {prescriptions}
            </Typography.Text>
            <Typography.Text>
              <strong> Tests: </strong> {tests}
            </Typography.Text>
            <br/>
            <Button onClick={() => {}}> View delivery status </Button>

            </div>
            
            <br/>
            <Button onClick={() => {
              setIsFileUploaded(false)
              setPrescriptions('')
            }}> Upload another file </Button>
          </div>
           : 
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography.Paragraph style={{'fontSize': 20}}>
              Upload your patient log, and we'll deliver you the 
              care you need, right to your door.
            </Typography.Paragraph>
            <br/>
            <DragAndDrop 
              setIsFileUploaded={setIsFileUploaded} 
              setPrescription={setPrescriptions}
            />
          </div>
        }
        
      </header>
    </div>
  );
}

export default App;
