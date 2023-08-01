const { db } = require('../../../utils/db');



/*
    SENSOR SERVICES
*/
async function createSensor(sensor, settings, stationId) {
    
    sensor.stationId = stationId;

    let created_sensor = await db.sensor.create({
        data: sensor,
    });

    settings.sensorId = created_sensor.id;

    await db.sensorSettings.create({
        data: settings,
    });

    return created_sensor.id;
}

async function findSensorById(id, withData, withSettings) {
    //console.log(id, withData, withSettings)
    return await db.sensor.findUnique({
        where: { 
            id:id
        },
        include: {
            data: withData,
            settings:withSettings
        }
    });
}

async function updateSensorById(sensor) {
    return await db.sensor.update({
        where: {
            id: sensor.id,
        },
        data: sensor,
    });
}

async function deleteSensorById(id) {
    return await db.sensor.delete({
        where: {
            id:id,
        },
    });
}


/*
    SETTINGS SERVICES
*/
async function updateSettingsById(sensorId, settings) {
    settings["pushStart"] = new Date(settings.pushStart)
    settings["pushEnd"] = new Date(settings.pushEnd)
    let updated_settings = await db.SensorSettings.update({
        where: {
            sensorId: sensorId,
          },
        data: settings
    });
    console.log('done')
    return updated_settings.id;
}



module.exports = {
    createSensor,
    findSensorById,
    updateSensorById,
    deleteSensorById,
    updateSettingsById,
}