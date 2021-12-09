import './Control.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import heartImg from './dog.png'

import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import mqtt from 'mqtt';

export default function HeartControl() {

  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState("No connection established");
  const [payload, setPayload] = useState({});

  useEffect(() => {
    if (client) {
      console.log(client)
      client.on('connect', () => {
        setConnectStatus('Connection established');
        document.getElementById('iLoveYouButton').hidden = false;
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

  const heartControlClick = (command) => {
    mqttPublish({topic:'tarasradio/heart', payload:command, qos:0})
    document.getElementById('meTooMessage').hidden = false;
    document.getElementById('dogImg').hidden = false;
  }

  return (
    <div className="App">
      <Container>
        <h1 className="title">Heart Control</h1>
        <p>{connectStatus}</p>
        <button 
          id='connectionButton' 
          type='button' 
          className='btn btn-primary btn-lg mt-3 mr-1' 
          onClick={()=>connectionClick()}>
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