const express = require('express');
const wt = require('node:worker_threads')
const application = express();
const { saveToDb,
        createNewSensor} = require('./utils')
const mqtt = require("mqtt");
require('dotenv').config();
const fs = require("fs");
const path = require("path")
var io = require('socket.io-client');
var host = `${process.env.APP_HOST || "localhost"}:${process.env.APP_PORT || 5002}`

var workerList = []
var balancer = 0
if(process.env.APP_MODE){
  const privateKey = fs.readFileSync(path.join("/etc/nginx/ssl/k-telecom.org.key"), "utf8");
  const certificate = fs.readFileSync(path.join("/etc/nginx/ssl/k-telecom.org.crt"), "utf8");
  const optSsl = {
    key: privateKey,
    cert: certificate
  };
  var https = require("https").Server(optSsl,application);
  var is = require("socket.io")(https);
  host = 'https://'+host
  for (let i = 0; i < 3; i++) {
    workerList.push(new wt.Worker('./worker.js',{
      parentPort:5111
    }))
  }
}
else{
  var http = require("http").Server(application);
  var is = require("socket.io")(http);
  host = 'http://'+host
  for (let i = 0; i < 3; i++) {    
    workerList.push(new wt.Worker('./worker.js',{
    parentPort:5111
  }))
  }
}

//var ioClient = io.connect(host)
const cors = require('cors');

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

application.use(cors(corsOptions));

application.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', true);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
});


const mqttUrl = "mqtt://hs.k-telecom.org:8883";
const mqttOptions = {
  // Clean session
  clean: true,
  connectTimeout: 1000,
  // Authentication
  clientId: Math.random(),
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};
console.log(mqttOptions)
const mqttClient = mqtt.connect(mqttUrl, mqttOptions);

mqttClient.on("connect", function () {
  if (mqttClient.connected) {
    console.log("conected");
    mqttClient.subscribe("#");  // Подпись на все топики где только 3 эллемента
  } else {
    console.log("disconeted");
  }
});


is.on("connection", function (socket) {

  socket.join("server");

  var ID = socket.id.toString().substr(0, 5);

  console.log("connect_USER: " + ID);


  socket.on("auth", function (data) {
    let room = data.room;

    socket.join(room);
    console.log("start room " + data.room);
    is.to(room).emit('cmd' , '{"action" : "auth"}')
    //mqttClient.publish(room + "/auth/get", '{"action" : "auth"}');
  });

  socket.on("disconnect", function () {
    console.log("OUT_USER: " + ID);
  });

  socket.on("broker", function (data , retain) {         //  Все сообщения к брокеру отправлять в это простарнство имен 
    let userId = "" + data.userId;             //
    let gatewayId = "" + data.gatewayId;      //  Формиурем топик 
    let device = "" + data.device;           //
    let message = "" + data.message;       //  Основной json , который собирается в фронте и отправляется к брокеру 

    mqttClient.publish(userId + "/" + gatewayId + "/" + device, message , {retain : retain}); // Отправлем комманду на шлюз с айди устройством 
  });
});

mqttClient.on("message", async function (topic, payload) {
  const forWorkerData = {
    topic : topic,
    payload: payload.toString()
  }
  workerList[balancer].postMessage(JSON.stringify(forWorkerData))
  balancer==workerList.length-1 ? balancer=0:balancer+=1
  //is.emit('test', obj, getTopic)
  // Payload is Buffer
  
});


if(process.env.APP_MODE){
  https.listen(5002, function () {
    console.log("Клиентский канал запущен, порт по https: " + 5002);
  });
}
else{
  http.listen(5002, function () {
    console.log("Клиентский канал запущен, порт: " + 5002);
  });
}

module.exports = {
  is
}