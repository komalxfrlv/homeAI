const express = require('express');
const  lodash = require('lodash');
const application = express();
const mqtt = require("mqtt");

const fs = require("fs");
const path = require("path")
const privateKey = fs.readFileSync(path.join("/etc/nginx/ssl/k-telecom.org.key"), "utf8");
const certificate = fs.readFileSync(path.join("/etc/nginx/ssl/k-telecom.org.crt"), "utf8");

const optSsl = {
  key: privateKey,
  cert: certificate,
 // ca: [certificate],
  requestCert: false, // put true if you want a client certificate, tested and it works
  rejectUnauthorized: false,
};

const https = require("https").Server(optSsl,application);


const is = require("socket.io")(https);
const io = require('socket.io-client');
const ioClient = io.connect(`https://${process.env.APP_HOST}:${process.env.APP_PORT}`)

const { db } = require('./src/db');

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
  clientId: process.env.MQTT_CLIENT_ID,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
};
console.log(mqttOptions)
const mqttClient = mqtt.connect(mqttUrl, mqttOptions);

mqttClient.on("connect", function () {
  if (mqttClient.connected) {
    console.log("conected");
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
    //socket.to(room).emit("cmd" , {action : 'auth'}); 
    console.log("start room " + data.room);
    mqttClient.publish(room + "/" + data.gatewayId + "/get", '{"action" : "auth"}');
  });

  socket.on("disconnect", function () {
    console.log("OUT_USER: " + ID);
  });

  socket.on("broker", function (data , retain) {         //  Все сообщения к брокеру отправлять в это простарнство имен 
    let userId = "" + data.userId;             //
    let gatewayId = "" + data.gatewayId;      //  Формиурем топик 
    let device = "" + data.device;           //
    let message = "" + data.message;       //  Основной json , который собирается в фронте и отправляется к брокеру 

    //console.log("{ onBroker: " + userId + "/" + gatewayId + "/" + device + "\n" + "message: " + message + " }");

    mqttClient.publish(userId + "/" + gatewayId + "/" + device, message , {retain : retain}); // Отправлем комманду на шлюз с айди устройством 
  });
});

ioClient.on('saveToDb', async function (getedData, topic) {
  let userId = topic[0];
  let gatewayId = topic[1];
  let elementId = topic[2];
  
  delete getedData.modeTelecom;


  console.log('pizdata:', getedData);
  console.log('/' + userId + '/' + gatewayId + '/' + elementId);
  try {

    let sensor = await db.sensor.findFirst({
      where: {
        elementId: elementId
      },
      include:{
        device:true,
        data:{
          take:1,
          orderBy:[{
            createdAt:"desc"
          }]
        },
        station:true,
            data:{
              orderBy:{
                createdAt:"desc"
              }
            },
            settings:{
              include:{
                room:true
              }
            }
      }
    });
    const dataKeys = Object.keys(getedData)
    let dataToWrite = {}
    console.log(sensor)
    dataKeys.forEach((field, i) => {
      sensor.device.majorFields.includes(field)?dataToWrite[field] = getedData[field]:""
    });    
    console.log(sensor.data[0].value)
    console.log(dataToWrite)
    console.log('sensor:' + sensor.id);
    if(!lodash.isEqual(dataToWrite, sensor.data[0].value)){
      let newData = await db.data.create({
        data: {
          value: dataToWrite,
          sensorId: sensor.id,
        }
      });
      if(sensor.device.frontView.chartData){
        const toLog = {
          userId:     userId,
          stationId:  sensor.stationId,
          sensorId:   sensor.id,
          dataId:     newData.id,
          sensorName: sensor.settings.name,
          roomName:   sensor.SensorSettings.Rooms.name
      }
        writeToLog(toLog, 4)
      }
      console.log(`writen\n\n`)
    }
    else{
      console.log(`duplicate data\n\n`)
    }

    console.log('data: ' + newData);
  }
  catch (err) {
    console.log(err)
  }

});


mqttClient.on("message", function (topic, payload, packet) {
  // Payload is Buffer
  var getTopic = topic.split("/");   //  Получаем топики
  
  // is.emit(getSend.message, {getSend: getSend, getTopic: getTopic})
  try {
    var obj = JSON.parse(payload.toString())
    obj.linkquality? obj.linkquality = Math.round((obj.linkquality/255)*100) :""
    if (obj['mT']) {
      is.emit(obj['mT'], obj, getTopic);
      //console.log("gavnormal = " + obj['modeTelecom']);
    }
    else {
      if (getTopic.length == 3) {
        is.emit('saveToDb', obj, getTopic)
      }
    }
    let cmdData = {
      payload: obj,
      topic:{
        gatewayId: getTopic[1],
        elementID: getTopic[2]
      }
    }
    is.to(getTopic[0]).emit("cmd", cmdData.toString());
  } catch (e) {
    //console.log('oshibka: Error parsing')
  }
  //console.log("gavnormal");
});

async function writeToLog(data, code){
  try{
    const url = `http://${process.env.LOGGER_HOST || "localhost"}:${process.env.LOGGER_PORT || "5282"}/${code}` 
    const postData = {
      method: "POST",
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      data: data
      })
    }
    await fetch(url, postData)
    .then(console.log(`Data logged`))
    .catch(err => {throw new Error(err)})
  }
  catch(err){
    console.log(err)
  }
}

application.listen(5002, function () {
  console.log("Клиентский канал запущен, порт: " + 5002);
});