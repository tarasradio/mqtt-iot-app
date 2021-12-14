import './Control.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import heartImg from './dog.png'

import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import useMQTTClient from '../components/MQTTClient';

export default function HeartControl() {

  const onConnected = () => {
    document.getElementById('iLoveYouButton').hidden=false;
  }

  const [ connect, connectionStatus, publish ] = useMQTTClient(onConnected);

  const heartControlClick = (command) => {
    publish({topic:'tarasradio/heart', payload:command, qos:0})
    document.getElementById('meTooMessage').hidden = false;
    document.getElementById('dogImg').hidden = false;
  }

  return (
    <div className="App">
      <Container>
        <h1 className="title">Heart Control</h1>
        <p>{connectionStatus}</p>
        <button 
          id='connectionButton' 
          type='button' 
          className='btn btn-primary btn-lg mt-3 mr-1' 
          onClick={()=>connect()}>
          Connect
        </button >
        <button 
                id='iLoveYouButton'
                hidden='true'
                type='button'
                className='rc-btn btn btn-danger btn-lg'
                onClick={()=>{heartControlClick('on')}}
              >
                Я тебя люблю!
        </button>
        <br></br>
        <img id='dogImg'className='dogImgStyle' hidden = 'true' src={heartImg} height='200px'></img>
        <h1 id='meTooMessage'  hidden='true'>И я тебя люблю =)</h1>
      </Container>
    </div>
  );
}