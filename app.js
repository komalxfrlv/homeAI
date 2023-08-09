const express = require('express');
const application = express();
var fs = require("fs");

const mqtt = require("mqtt");

const http = require("http").Server(application);
const is = require("socket.io")(http);

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
  //var getSend = payload.toString();
  console.log("getTopic = " + payload.toString());
  // var getSend = JSON.parse(payload.toString()); //  Получаем сообщение 

  // is.emit(getSend.message, {getSend: getSend, getTopic: getTopic})
  try {
    let obj = JSON.parse(payload.toString())

    if (obj.modeTelecom) {
      is.emit("saveToDb", '{"payload": "1488"}');
      console.log("gavnormal = " + obj['modeTelecom']);
    }
  } catch (e) {
    console.log('oshibka: Error parsing')
  }
  console.log();

  /* 
      Берем из базы инфоу о том , кому прниаждлежит шлюз 
  */
  // отправляем в соотвествующую  комнату    
 // is.to(getTopic[0]).emit("cmd", '{"payload":[ ' + payload.toString() + '], "topic" : [' + JSON.stringify(getTopic) + "]}");

});

is.on("connection", function (socket) {
  var ID = socket.id.toString().substr(0, 5);
  console.log("connect_USER: " + ID);

  socket.on("saveToDb", function (data) {
    console.log("pizdata: " + data);

    var writeStream = fs.createWriteStream("JournalDEV.txt");
    writeStream.write("Hi, JournalDEV Users. ");
    writeStream.write("Thank You.");
    writeStream.write(data);
    writeStream.end();

  });

  // auth для захода в сокет комнату по какому то типу данных (В данном случае по логину)

  socket.on("auth", function (data) {
    let room = data.room; // Под вопросом 
   // socket.join(room); // входим сокетами в комнату юзвера 
    console.log("get + device " + data.gatewayId); // have - это id шлюза , который принадлежит юзверу  
    mqttClient.publish(room + "/" + data.gatewayId + "/bridge/config/devices/get", ""); // Получаем данные шлюза
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

  socket.on("broker", function (data) {         //  Все сообщения к брокеру отправлять в это простарнство имен 
    let userId = "" + data.userId;             //
    let gatewayId = "" + data.gatewayId;      //  Формиурем топик 
    let device = "" + data.device;           //
    let message = "" + data.message;       //  Основной json , который собирается в фронте и отправляется к брокеру 

    console.log("{ onBroker: " + userId + "/" + gatewayId + "/" + device + "\n" + "message: " + message + " }");

    mqttClient.publish(userId + "/" + gatewayId + "/" + device, message); // Отправлем комманду на шлюз с айди устройством 
  });

});

http.listen(5002, function () {
  console.log("Клиентский канал запущен, порт: " + 5002);
});