import { useState, useEffect } from 'react';
import mqtt from 'mqtt';

const useMQTTClient = (onConnected) => {
  const [client, setClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("No connection established");
  const [payload, setPayload] = useState({});

  useEffect(() => {
    if (client) {
      console.log(client)
      client.on('connect', () => {
        setConnectionStatus('Connection established');
        console.log(onConnected);
        onConnected();
        document.getElementById('connectionButton').hidden = true;
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setConnectionStatus('Reconnect...');
      });
      client.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() };
        setPayload(payload);
      });
    }
  }, [client]);

  const mqttConnect = (host, mqttOption) => {
    setConnectionStatus('Connect...');
    setClient(mqtt.connect(host, mqttOption));
  };

  const publish = (context) => {
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

  const connect = () => {
    connection(broker.host, broker.port, broker.clientId, "", "")
  }

  return(
    [ connect, connectionStatus, publish ]
  )
}

export default useMQTTClient;