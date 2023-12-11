const {workerData, kill} = require('node:worker_threads')

async function workWithData(){
    const parsedData = JSON.parse(workerData)
    console.log(parsedData)
    var getTopic = parsedData.topic.split("/");   //  Получаем топики
      try {
        var obj = JSON.parse(parsedData.payload)
        obj.linkquality? obj.linkquality = Math.round((obj.linkquality/255)*100) :""
        let cmdData = {
          payload: obj,
          topic:{
            gatewayId: getTopic[1],
            elementID: getTopic[2]
          }
        }
        if(getTopic[3] != "set") is.to(getTopic[0]).emit("cmd", JSON.stringify(cmdData));
        if (getTopic.length == 3 || obj['mT']) {
          await saveToDb(obj, getTopic)
        }
        if(obj['type']=="device_connected"){
          const sensor = await createNewSensor(obj, getTopic)
          //mqttClient.publish("cmd", sensor.id,)
          const message = {
            type:"device_created",
            sensorId: sensor.id
            }
          is.to(getTopic[0]).emit("cmd", JSON.stringify(message));
        }
    
      } catch (e) {
        console.log(workerData)
        obj != "online" || obj != "online"?console.log(e):""
      }
}
workWithData().then(()=>{
    kill
})
  