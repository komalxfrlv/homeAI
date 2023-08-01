const {
    validateStation,
    validateStationsSettings,
} = require('./stations.validators');
const currentUser = require('../../../utils/getUser');
const { findVersionById } = require('../versions/versions.services');
const { findDevicebyId } = require('../devices/devices.services');
const {
    createStation,
    findStationById,
    findAllStation,
    updateSettingsById,
    deleteStationById
} = require('./stations.services');

async function getAllStations(req, res, next) {
    try {
        const { userId } = req.payload;

        let stations = await findAllStation(userId);

        if (!stations) {
            res.status(400);
            //console.log(stations)
            throw new Error("Can't find station with this id");
        }

        res.json(stations);
    } catch (err) {
        next(err);
    }
}

async function createNewStation(req, res, next) {
    try {
        const { userId } = req.payload;

        let newStation = req.body.station;
        let newSettings = req.body.settings;

        /*
        if (!(newStation && newSettings)) {
            console.dir(`
            station: \n${JSON.stringify(newStation)}\n\n 
            settings:\n ${JSON.stringify(newSettings)}`)
            throw new Error('In request must be station and settings. ');
        }

        let version = await findVersionById(newSettings.versionId);

        if (!version) {
            console.log(`version: \n${JSON.stringify(version)}\n`)
            throw new Error(`Can't find version`);
        }
        */
       
        /*
        if (version.deviceId != newStation.deviceId) {
            let versionDeviceType = await findDevicebyId(version.deviceId)
            let stationDeviceType = await findDevicebyId(newStation.deviceId)
            console.log(`
            version: \n${JSON.stringify(version)}\n\n 
            station:\n${JSON.stringify(newStation)}\n\n`)
            throw new Error(`This version for ${versionDeviceType.name}, not for ${stationDeviceType.name}`);
        }
        */

        await validateStation(newStation)
        await validateStationsSettings(newSettings)

        let station = await createStation(newStation, newSettings, userId);

        res.json(station);
    } catch (err) {
        next(err);
    }
}

async function getStationById(req, res, next) {
    try {
        const stattionId = req.query.id
        const station = await findStationById(stattionId)
        if (!station) {
            res.status(400);
            console.log(station)
            throw new Error("Can't find station with this id");
        }

        const { userId } = req.payload

        if (station.userId !== userId) {
            res.status(400);
            //console.log(station + " " + userId)
            throw new Error('Not your sensor. ');
        }
        res.json(station);
    } catch (err) {
        next(err);
    }
}

async function editSettings(req, res, next) {
    try {
        const station = await findStationById(req.body.station.id);
        let newSettings = req.body.settings;
        console.log(station)
        if (!station) {
            throw new Error(`Can't find station`);
        }

        console.log(newSettings)
        let a = await updateSettingsById(station.id, newSettings);
        console.log(a);

        res.json(a);
    } catch (err) {
        next(err);
    }
}

async function deleteStation(req, res, next) {
    try {
        const { userId } = req.payload
        const stationId = req.body.station.id
        console.log(stationId)
        const station = await findStationById(stationId)

        if (!station) {
            res.status(400);
            console.log(station)
            throw new Error("Can't find sensor with this id");
        }

        if (station.userId !== userId) {
            res.status(400);
            console.log(`${station} ${userId}`)
            throw new Error('Not your station. ');
        }
        await deleteStationById(station.id);
        res.json(station);
    }
    catch (err) {
        next(err);
    }
}

module.exports = {
    createNewStation,
    getStationById,
    getAllStations,
    editSettings,
    deleteStation
}