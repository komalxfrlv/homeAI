const express = require('express');
const application = express();

const mqtt = require("mqtt");

const http = require("http").Server(application);
const is = require("socket.io")(http);
const io = require('socket.io-client');
const ioClient = io.connect('http://localhost:5002')

const { db } = require('./src/db');

const mqttUrl = "mqtt://hs.k-telecom.org:8883";
const mqttOptions = {
  // Clean session
  clean: true,
  connectTimeout: 1000,
  // Authentication
  clientId: "serv",
  username: "MQTTUser",
  password: "MQTTpassword1!",
};

const mqttClient = mqtt.connect(mqttUrl, mqttOptions);

mqttClient.on("connect", function () {
  if (mqttClient.connected) {
    //console.log("conected");
    mqttClient.subscribe("#");  // Подпись на все топики
  } else {
    console.log("disconeted");
  }
});

const uuid = require("uuid");
const apple = uuid.v4();

is.on("connection", function (socket) {

  socket.join("server");

  var ID = socket.id.toString().substr(0, 5);

  console.log("connect_USER: " + ID);


  socket.on("auth", function (data) {
    let room = data.room;

    socket.join(room);

    mqttClient.publish(room + "/" + data.gatewayId + "/bridge/config/devices/get", "");
  });

  socket.on("disconnect", function () {
    console.log("OUT_USER: " + ID);
  });

  socket.on("broker", function (data) {         //  Все сообщения к брокеру отправлять в это простарнство имен 
    let userId = "" + data.userId;             //
    let gatewayId = "" + data.gatewayId;      //  Формиурем топик 
    let device = "" + data.device;           //
    let message = "" + data.message;       //  Основной json , который собирается в фронте и отправляется к брокеру 

    //console.log("{ onBroker: " + userId + "/" + gatewayId + "/" + device + "\n" + "message: " + message + " }");

    mqttClient.publish(userId + "/" + gatewayId + "/" + device, message); // Отправлем комманду на шлюз с айди устройством 
  });
});

ioClient.on('saveToDb', async function (data, topic) {
  let userId = topic[0];
  let gatewayId = topic[1];
  let elementId = topic[2];

  console.log('pizdata:', data);
  console.log('/' + userId + '/' + gatewayId + '/' + elementId);
  try {

    let sensor = await db.sensor.findFirst({
      where: {
        elementId: elementId
      }
    });

    console.log('sensor:' + sensor);

    let newData = await db.data.create({
      data: {
        value: data,
        sensorId: sensor.id,
      }
    });

    console.log('data: ' + newData);
  }
  catch (err) {
    console.log(err)
  }

});


mqttClient.on("message", function (topic, payload, packet) {
  // Payload is Buffer
  var getTopic = topic.split("/");   //  Получаем топики
  var getSend = payload.toString();
  //console.log("getTopic = " + getTopic);
  // var getSend = JSON.parse(payload.toString()); //  Получаем сообщение 

  // is.emit(getSend.message, {getSend: getSend, getTopic: getTopic})
  try {
    let obj = JSON.parse(payload.toString())

    if (obj['modeTelecom']) {
      is.emit(obj['modeTelecom'], obj, getTopic);
      console.log("gavnormal = " + obj['modeTelecom']);
    }
    else {
      if (getTopic.length == 3) {
        is.emit('saveToDb', obj['data'], getTopic)
        console.log("saving zigbee data")
      }
    }

  } catch (e) {
    //console.log('oshibka: Error parsing')
  }
  //console.log("gavnormal");
  is.to(getTopic[0]).emit("cmd", '{"payload":[ ' + payload.toString + '], "topic" : [' + getTopic + "]}");
});



http.listen(5002, function () {
  console.log("Клиентский канал запущен, порт: " + 5002);
});