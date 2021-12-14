import 'bootstrap/dist/css/bootstrap.min.css';
import './Control.css'

import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import useMQTTClient from '../components/MQTTClient';

function RobotControl() {

  const onConnected = () => {
    document.getElementById('rc-buttons').hidden=false;
  }

  const [ connect, connectionStatus, publish ] = useMQTTClient(onConnected);

  const robotControlClick = (command) => {
    publish({topic:'tarasradio/robot', payload:command, qos:0})
  }

  return (
    <div className="App">
      <Container>
        <h1 className="title">Robot Control</h1>
        <p>{connectionStatus}</p>
        <button 
          id='connectionButton' 
          type='button' 
          className='btn btn-primary btn-lg mt-3 mr-1' 
          onClick={()=>connect()}>
          Connect
        </button >
        <table id="rc-buttons" align="center" hidden="true">
          <tr>
            <td colspan='2'>
              <button 
                id='forwardButton' 
                type='button'
                className='rc-btn btn btn-primary btn-lg'
                onPointerDown={()=>{robotControlClick('forward')}}
                onPointerUp={()=>{robotControlClick('stop')}}
              >
                Forward
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <button
                id='turnLeftButton' 
                type='button' 
                className='rc-btn btn btn-primary btn-lg'
                onPointerDown={()=>{robotControlClick('turn-left')}}
                onPointerUp={()=>{robotControlClick('stop')}}
              >
                Turn Left
              </button>
            </td>
            <td>
              <button 
                id='turnRightButton' 
                type='button' 
                className='rc-btn btn btn-primary btn-lg'
                onPointerDown={()=>{robotControlClick('turn-right')}}
                onPointerUp={()=>{robotControlClick('stop')}}
              >
                Turn Right
              </button>
            </td>
          </tr>
          <tr>
            <td colspan='2'>
              <button 
                id='forwardButton' 
                type='button' 
                className='rc-btn btn btn-primary btn-lg'
                onPointerDown={()=>{robotControlClick('backward')}}
                onPointerUp={()=>{robotControlClick('stop')}}
              >
                Backward
              </button>
            </td>
          </tr>
          <tr>
            <td colspan='2'>
            <button 
                id='tailButton' 
                type='button' 
                className='rc-btn btn btn-danger btn-lg'
                onMouseDown={()=>{robotControlClick('tail-wag')}}
                onMouseUp={()=>{robotControlClick('tail-stop')}}
                onPointerDown={()=>{robotControlClick('tail-wag')}}
                onPointerUp={()=>{robotControlClick('tail-stop')}}
              >
                Wag the tail
              </button>
            </td>
          </tr>
          <tr>
            <td colspan='2'>
            <button 
                id='signalButton' 
                type='button' 
                className='rc-btn btn btn-success btn-lg'
                onPointerDown={()=>{robotControlClick('signal')}}
                onPointerUp={()=>{robotControlClick('signal-stop')}}
              >
                Music!
              </button>
            </td>
          </tr>
        </table>
      </Container>
    </div>
  );
}

export default RobotControl;