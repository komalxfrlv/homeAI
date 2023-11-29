const fetch = require('node-fetch');
const { db } = require('./src/db');
const  lodash = require('lodash');
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
      .then(console.log(`Logged with code ${code}`))
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
      dataKeys.forEach((field) => {
        sensor.device.majorFields.includes(field)?dataToWrite[field] = getedData[field]:""
      });
      if(!lodash.isEmpty(sensor) && (lodash.isEmpty(sensor.data[0]) || !lodash.isEqual(dataToWrite, sensor.data[0].value) && !lodash.isEmpty(dataToWrite))){
        
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
        const logFields = Object.keys(sensor.device.fieldsToLog)
        console.log(await newData)
        logFields.forEach(field =>{
          const newValue = getedData[field]
          const lastValue = sensor.data[0].value[field]
          console.log(field)
          console.log(newValue)
          console.log(lastValue)
          console.log(getedData)
          console.log(sensor.data[0].value)
          if(!lodash.isEqual(newValue, lastValue)){
            let code
            const toLog = {
              userId:     userId,
              stationId:  sensor.stationId,
              sensorId:   sensor.id,
              dataId:     newData.id,
              sensorName: sensor.settings.name,
              roomName:   sensor.settings.Rooms.name
            }
            //console.dir(sensor.settings.options)
            //console.log(field)
            if(Object.keys(sensor.device.fieldsToLog[field]).includes("MTMax")){
              const maxValue = sensor.settings.options.max[field]
              const minValue = sensor.settings.options.min[field]
              const newValue = newData.value[field]
              const backToNormal = (lastValue < minValue || lastValue > maxValue) &&
              (minValue<newValue && maxValue>newValue)
              if(lastValue < maxValue && maxValue < newValue){
                code = sensor.device.fieldsToLog[field]["MTMax"]
              } 
              if(lastValue > minValue && minValue > newValue){
                code = sensor.device.fieldsToLog[field]["LTMin"]
              }
              if(backToNormal){
                code = sensor.device.fieldsToLog[field]["BTN"]
               }     
            }
            else{
              if(lodash.isNumber(sensor.device.fieldsToLog[field])){
                code = sensor.device.fieldsToLog[field]
              }
              else{
                code = sensor.device.fieldsToLog[field][String(newValue)]
              }
            }
            code  ? writeToLog(toLog, code):console.log('data must been logged, but havent logCode')
          }
        })
        console.log(`writen\n\n`)
        }
        else{
          console.log(`duplicate data`)
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
        const url = `http://${process.env.MONOLITH_HOST || "localhost"}:${process.env.MONOLITH_PORT || "5228"}/api/localhost/newSensor` 
        const postData = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
          body: JSON.stringify({
            sensor:{
                mac:getedData.meta['modelID'],
                elementId:getedData.message
            },
            settings:{
                name:"Новый датчик"
            },
            stationId:station.id,
            userId:station.userId
          })
        }
        console.log(url)
        const res =  await fetch(url, postData)
        .then(console.log(`Sensor created`))
        .catch(err => {throw new Error(err)})
        return res.json()
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