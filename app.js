//import { PrismaClient } from '@prisma/client'
//const prisma = new PrismaClient()

const express = require('express');

const mqtt = require("mqtt");
var is = require("socket.io")(http);

var application = express();
var http = require("http").Server(application);

//const { db } = require('./src/db');

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
    console.log("conected");
    mqttClient.subscribe("#");  // Подпись на все топики
  } else {
    console.log("disconeted");
  }
});

mqttClient.on("message", function (topic, payload, packet) {
  // Payload is Buffer
  var getTopic = topic.split("/");   //  Получаем топики
  var getSend = payload.toString();

  console.log("Topics - " + getTopic);
  console.log("payload - " + (getSend));



  // var getSend = JSON.parse(payload.toString()); //  Получаем сообщение 

  // is.emit(getSend.message, {getSend: getSend, getTopic: getTopic})

  /* 
      Берем из базы инфоу о том , кому прниаждлежит шлюз 
  */
  // отправляем в соотвествующую  комнату    
  //is.to(login).emit("cmd", '{"payload":[ ' + JSON.stringify(getSend) + '], "topic" : [' + JSON.stringify(getTopic) + "]}");

});

is.on("connection", function (socket) {
  var ID = socket.id.toString().substr(0, 5);
  //socket.join(ID);

  console.log("connect_USER: " + ID);

  // auth для захода в сокет комнату по какому то типу данных (В данном случае по логину)

  socket.on("auth", function (data) {
    var login = data.user;
    let uid = data.uid; // Под вопросом 
    socket.join(login); // входим сокетами в комнату юзвера 
    console.log("Получаем шлюз  с логина -   - " + login + " - ");
    /*
        Берем login юзверу и из базы берем id шлюза ,который ему принадлежит (have)
    */
    console.log("get + device " + have); // have - это id шлюза , который принадлежит юзверу  
    mqttClient.publish(uid + "/" + have + "/bridge/config/devices/get", ""); // Получаем данные шлюза

  });

  socket.on("permit_join", function (data) {
    let id = data.user;
    let uid = data.uid;
    //socket.join(login);

    console.log(ID + " - permit_join - from id - ");
    mqttClient.publish(uid + "/" + id + "/bridge/config/permit_join", '{"permit_join ": true}'); // Включаем сопряжение 
  });

  socket.on("delete_device", function (data) {
    let id = data.user;
    let device = data.device;
    let uid = data.uid;

    console.log(ID + " - delete_divece -" + id);
    mqttClient.publish(uid + "/" + id + "/bridge/config/force_remove", device); // Удаляем девайс по иди
  });

  // Создание нового датчиика 
  socket.on("connected", async function (data) {
    console.log("Создание датчика: " + data);
    await db.sensor.create({
      data: data
    });
  });

  socket.on("disconnect", function () {
    console.log("OUT_USER: " + ID);
  });

  socket.on("broker", function () {         //  Все сообщения к брокеру отправлять в это простарнство имен 
                                           //
    let userId = data.userId;             //
    let gatewayId = data.gatewayId;      //  Формиурем топик 
    let device = data.device;           //
                                       //
    let message = data.message;       //  Основной json , который собирается в фронте и отправляется к брокеру 
    console.log("{ onBroker: " + userId + "/" + gatewayId + "/" + device + "\n" + "message: " + message + " }");
    mqttClient.publish(userId + "/" + gatewayId + "/" + device, message); // Отправлем комманду на шлюз с айди устройством 
  });

});

http.listen(5002, function () {
  console.log("Клиентский канал запущен, порт: " + 5002);
});