import 'bootstrap/dist/css/bootstrap.min.css';
import './Control.css'

import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import mqtt from 'mqtt';

function RobotControl() {

  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState("No connection established");
  const [payload, setPayload] = useState({});

  useEffect(() => {
    if (client) {
      console.log(client)
      client.on('connect', () => {
        setConnectStatus('Connection established');
        document.getElementById('rc-buttons').hidden = false;
        document.getElementById('connectionButton').hidden = true;
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setConnectStatus('Reconnect...');
      });
      client.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() };
        setPayload(payload);
      });
    }
  }, [client]);

  const mqttConnect = (host, mqttOption) => {
    setConnectStatus('Connect...');
    setClient(mqtt.connect(host, mqttOption));
  };

  const mqttPublish = (context) => {
    if (client) {
      const { topic, qos, payload } = context;
      client.publish(topic, payload, { qos }, error => {
        if (error) {
          console.log('Publish error: ', error);
        }
      });
    }
  };

  const broker = {
    host: 'broker.hivemq.com',
    clientId: `mqttjs_ + ${Math.random().toString(16).substr(2, 8)}`,
    port: 8000,
  };


  const connection = (host, port, clientId, username, password) => {
    const url = `ws://${host}:${port}/mqtt`;
    const options = {
      keepalive: 30,
      protocolId: 'MQTT',
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
      },
      rejectUnauthorized: false
    };
    options.clientId = clientId;
    options.username = username;
    options.password = password;

    mqttConnect(url, options);
  }

  const connectionClick = () => {
    connection(broker.host, broker.port, broker.clientId, "", "")
  }

  const robotControlClick = (command) => {
    mqttPublish({topic:'tarasradio/robot', payload:command, qos:0})
  }

  return (
    <div className="App">
      <Container>
        <h1 className="title">Robot Control</h1>
        <p>{connectStatus}</p>
        <button 
          id='connectionButton' 
          type='button' 
          className='btn btn-primary btn-lg mt-3 mr-1' 
          onClick={()=>connectionClick()}>
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
                // onMouseDown={()=>{robotControlClick('forward')}}
                // onMouseUp={()=>{robotControlClick('stop')}}
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
                // onMouseDown={()=>{robotControlClick('turn-left')}}
                // onMouseUp={()=>{robotControlClick('stop')}}
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
                // onMouseDown={()=>{robotControlClick('turn-right')}}
                // onMouseUp={()=>{robotControlClick('stop')}}
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