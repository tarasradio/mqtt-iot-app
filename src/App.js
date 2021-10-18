import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

function App() {

  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState('Подключение не установленно');
  const [payload, setPayload] = useState({});
  const [countOfClicks, setCountOfClicks] = useState(0);

  useEffect(() => {
    if (client) {
      console.log(client)
      client.on('connect', () => {
        setConnectStatus('Подключение установленно');
        document.getElementById('iLoveYouButton').hidden = false;
        document.getElementById('connectionButton').hidden = true;
      });
      client.on('error', (err) => {
        console.error('Ошибка подключения: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setConnectStatus('Повторное подключение...');
      });
      client.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() };
        setPayload(payload);
      });
    }
  }, [client]);

  const mqttConnect = (host, mqttOption) => {
    setConnectStatus('Подключение...');
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
    const url = `wss://${host}:${port}/mqtt`;
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

  const connectionButtonClick = () => {
    connection(broker.host, broker.port, broker.clientId, "", "")
  }

  const loveButtonClick = () => {
    mqttPublish({topic:'tarasradio/heart', payload:'1', qos:2})
    setCountOfClicks(countOfClicks + 1);

    document.getElementById('firstText').hidden = (countOfClicks > 0);
    document.getElementById('hiddenText').hidden = (countOfClicks == 0);
  }

  return (
    <div className="App">
      <div className="container-fluid">
        <h1>Полина управляет</h1>
        <p>{connectStatus}</p>
        <button 
          id='connectionButton' 
          type='button' 
          className='btn btn-primary btn-lg mt-3 mr-1' 
          onClick={()=>connectionButtonClick()}>
          Подключиться
        </button >
        <button 
          id='iLoveYouButton' 
          type='button' 
          hidden='true' 
          className='btn btn-outline-danger btn-lg mt-3' 
          onClick={()=>loveButtonClick()}>
          Я тебя люблю!
        </button >
        <p className='mt-3'>Привет, Полина!</p>
        <p>Сначала, нажми "Подключиться"</p>
        <p id='firstText'>Затем, смотря на Пашу, нажми "Я тебя люблю")))</p>
        <p id='hiddenText' hidden='true'>Нажимай на кнопку чтобы зажигать сердце!</p>
      </div>
      
    </div>
  );
}

export default App;
