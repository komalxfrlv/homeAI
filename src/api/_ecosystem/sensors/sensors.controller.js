const {
    validateSensor,
    validateSensorSettings,
} = require('./sensors.validators');

const {
    createSensor,
    findSensorById,
    updateSettingsById,
    deleteSensorById,
} = require('./sensors.services');

const {
    findStationById
} = require('../stations/stations.services')

const { findVersionById } = require('../versions/versions.services');
const { findDevicebyId } = require('../devices/devices.services');


/*
    SENSOR CONTROLLERS
*/
async function createNewSensor(req, res, next) {
    try {
        let newSensor = req.body.sensor;
        let newSettings = req.body.settings;
        let stationId = req.body.stationId;

        if(! (stationId && newSensor && newSettings) ){
            console.log('there must be sensor, settings and stationId')
            throw new Error('In request must be sensor, settings and stationId. ');
        }
        const { userId } = req.payload

        const station = await findStationById(stationId)
        
        if(!station){
            res.status(400);
            console.log(station)
            throw new Error("Can't find station with this id");
        }
        let version = await findVersionById(newSettings.versionId)

        if(!version){
            console.log(`version: \n${JSON.stringify(version)}\n`)
            throw new Error(`Can't find version`);
        }


        if (version.deviceId != newSensor.deviceId){
            let versionDeviceType = await findDevicebyId(version.deviceId)
            let sensorDeviceType = await findDevicebyId(newSensor.deviceId)
            console.log(`
            version: \n${JSON.stringify(version)}\n\n 
            station:\n${JSON.stringify(newSensor)}\n\n`)
            throw new Error(`This version for ${versionDeviceType.name}, not for ${sensorDeviceType.name}`);
        }

        //console.log(station.userId)
        if (station.userId !== userId) { 
            res.status(400);
            throw new Error('Not your station. ');
        }
        await validateSensor(newSensor);
        await validateSensorSettings(newSettings);
        
        let a = await createSensor(newSensor, newSettings, stationId);
        
        //console.log(a);

        res.json(a);
    } catch (err) {
        next(err);
    }
}

async function getSensorById(req, res, next) {
    try{
    const sensorId = req.query.id
    var withData = req.query.withData == "true" ? true : false
    var withSettings = req.query.withSettings == "true" ? true : false
    //console.log(sensorId, withData, withSettings)
    const sensor = await findSensorById(sensorId, withData, withSettings)

    if(!sensor){
        res.status(400);
        //console.log(sensor)
        throw new Error("Can't find sensor with this id");
    }


    const { userId } = req.payload
    const station = await findStationById(sensor.stationId)


    if (station.userId !== userId){
        res.status(400);
        //console.log(station+" "+userId)
        throw new Error('Not your sensor. ');
    }


    res.json(sensor);
    }
    catch(err){
        next(err);
    }
}

async function deleteSensor(req, res, next) {
    try{
    const sensorId = req.body.sensor.id
    const sensor = await findSensorById(sensorId)

    if(!sensor){
        res.status(400);
        //console.log(sensor)
        throw new Error("Can't find sensor with this id");
    }

    const { userId } = req.payload
    const station = await findStationById(sensor.stationId)

    if (station.userId !== userId){
        res.status(400);
        //console.log(`${station.id} ${userId}`)
        throw new Error('Not your sensor. ');
    }
    await deleteSensorById(sensorId);
    res.json(sensor.id);
    }
    catch(err){
        next(err);
    }
}

/*
    SETTINGS CONTROLLERS
*/

async function editSettings(req, res, next) {
    try {
        const sensor = await findSensorById(req.body.sensor.id);
        console.log(sensor.id)
        if(!sensor){
            throw new Error(`Can't find sensor`);
        }
        let newSettings = req.body.settings;
        //console.log(newSettings)
        let a = await updateSettingsById(sensor.id, newSettings);
        //console.log(a);

        res.json(a);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createNewSensor,
    getSensorById,
    editSettings,
    deleteSensor
}