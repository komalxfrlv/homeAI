//import { PrismaClient } from '@prisma/client'
//const prisma = new PrismaClient()

const express = require('express');

const mqtt = require("mqtt");
var is = require("socket.io")(http);

var application = express();
var http = require("http").Server(application);

const mqttUrl = "mqtt://m2m-dev.k-telecom.org:8883";
const mqttOptions = {
  // Clean session
  clean: true,
  connectTimeout: 1000,
  // Authentication
  clientId: "client2",
  username: "m2m_msqt_mqtt_server",
  password: "!SDH23n12$uck$0m3D1cK2281488",
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
  console.log(`${payload.toString()}`);
  var getTopic = topic.split("/");   //  Получаем топики

  //var getSend = JSON.parse(payload.toString()); //  Получаем сообщение 

  //is.emit(getSend.message, {getSend: getSend, getTopic: getTopic})

  

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
    login = data.user;
    socket.join(login); // входим сокетами в комнату юзвера 
    console.log("Получаем шлюз  с логина -   - " + login + " - ");
    /*
        Получаем с базы have - id шлюза
    */
    console.log("get + device " + have); // have - это id шлюза , который принадлежит юзверу  
    mqttClient.publish("123456789/" + have + "/bridge/config/devices/get", ""); // Получаем данные шлюза

  });

  socket.on("permit_join", function (data) {
    let id = data.user;
    //socket.join(login);

    console.log(ID + " - permit_join -" + id);
    mqttClient.publish("123456789/" + id + "/bridge/config/permit_join", '{"permit_join ": true}'); // Включаем сопряжение 
  });

  socket.on("delete_device", function (data) {
    let id = data.user;
    let device = data.device;
    console.log(ID + " - delete_divece -" + id);
    mqttClient.publish("123456789/" + id + "/bridge/config/force_remove", device); // Удаляем девайс по иди
  });

  // Создание новой станции
  socket.on("announce", function (data) {
    console.log("Создание станции: " + data);
  });


  socket.on("disconnect", function () {
    console.log("OUT_USER: " + ID);
  });

  socket.on("broker", function () {
    let id = data.user;
    let device = data.device;
    let message = data.message;
    console.log(ID + " - delete_divece -" + id);
    mqttClient.publish("123456789/" + id + "/" + device, message); // Отправлем комманду на шлюз с айди устройством
  });

});

http.listen(process.env.PORT, function () {
  console.log("Клиентский канал запущен, порт: " + process.env.PORT);
});