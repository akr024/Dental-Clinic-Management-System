import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import { Notification } from './models/notificationModel.js';
import mqtt from 'mqtt';

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        }); 
    })
    .catch((error) => {
        console.log(error);
    })


var mqttClient;

// Change this to point to your MQTT broker or DNS name
const mqttHost = "127.0.0.1"; // this IP works on my local workstation
const protocol = "mqtt";
const port = "1883";

function connectToBroker() {
  const clientId = "client" + Math.random().toString(36).substring(7);

  // Change this to point to your MQTT broker
  const hostURL = `${protocol}://${mqttHost}:${port}`;

  const options = {
    keepalive: 60,
    clientId: clientId,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
  };
 
  mqttClient = mqtt.connect(hostURL, options);

  mqttClient.on("error", (err) => {
    console.log("Error: ", err);
    mqttClient.end();
  });

  mqttClient.on("reconnect", () => {
    console.log("Reconnecting...");
  });

  // code executed upon connection
  mqttClient.on("connect", () => {
    console.log("Client connected: " + clientId);
    subscribeToTopic("appointment");
  });

  // code executed upon receiving a published message
  mqttClient.on("message", (topic, message, packet) => {
    console.log(
      "Received Message: " + message + "\nOn topic: " + topic
    );
    
    var obj = JSON.parse(message);
    
    manageNotification(obj);
  });
}

// code for subscribing to all topics
function subscribeToTopic(topic) {
  console.log(`Subscribing to Topic: ${topic}`);

  mqttClient.subscribe(topic, { qos: 0 });
}

// notification creation and publishing function
async function manageNotification(obj){
  const newNotification = {
    title: obj.title,
    time: new Date(),
    desc: obj.desc || null
  }

  // creates the notification in the database
  const notification = await Notification.create(newNotification);
  console.log("Notification successfully created");
  
  // publishes the notification - (for APIs to use/display them)
  mqttClient.publish("notification", JSON.stringify(newNotification), {
    qos: 0,
    retain: true
  })
  console.log("Notification published to broker");
}

connectToBroker();