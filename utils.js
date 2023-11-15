
const { db } = require('./src/db');

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
      .then(console.log(`Logged`))
      .catch(err => {throw new Error(err)})
    }
    catch(err){
      console.log(err)
    }
  }

async function saveToDb(getedData, topic) {
    let userId = topic[0];
    let gatewayId = topic[1];
    let elementId = topic[2];
    
    delete getedData.modeTelecom;
  
  
    //console.log('pizdata:', getedData);
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
          settings:{
            include:{
              Rooms:true
            }
          }
        }
      });
      const dataKeys = Object.keys(getedData)
      let dataToWrite = {}
      dataKeys.forEach((field, i) => {
        sensor.device.majorFields.includes(field)?dataToWrite[field] = getedData[field]:""
      });    
      if(!lodash.isEqual(dataToWrite, sensor.data[0].value) && !lodash.isEmpty(dataToWrite)){
        console.log(topic)
        console.log(dataToWrite)
        console.log(sensor.data[0].value)
        let newData = await db.data.create({
          data: {
            value: dataToWrite,
            sensorId: sensor.id,
          }
        });
        await db.sensor.update({
          where:{
            id: sensor.id
          },
          data:{
            charge:getedData.battery || sensor.charge,
            linkquality:getedData.linkquality || sensor.linkquality
          }
        })
        if(!sensor.device.frontView.chartData){
          const toLog = {
            userId:     userId,
            stationId:  sensor.stationId,
            sensorId:   sensor.id,
            dataId:     newData.id,
            sensorName: sensor.settings.name,
            roomName:   sensor.settings.Rooms.name
        }
          writeToLog(toLog, 4)
        }
        console.log(`writen\n\n`)
      }
      else{
        console.log(`duplicate data\n\n`)
      }
  
      //console.log('data: ' + newData);
    }
    catch (err) {
      console.log(err)
    }
  
}

async function createNewSensor(getedData, topic){
    try{
        const station = await db.station.findFirst({
            where:{
                gatewayId: topic[1]
            }
        })
        const url = `https://${process.env.MONOLITH_HOST || "localhost"}:${process.env.MONOLITH_PORT || "5000"}/api/e/sensors` 
        const postData = {
          method: "POST",
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sensor:{
                mac:getedData.meta.modelId,
                elementId:getedData.message
            },
            settings:{
                name:"Новый датчик"
            },
            stationId:station.id
          })
        }
        await fetch(url, postData)
        .then(console.log(`Sensor created`))
        .catch(err => {throw new Error(err)})
      }
      catch(err){
        console.log(err)
      }
}

  module.exports = {
    writeToLog,
    saveToDb,
    createNewSensor
  }