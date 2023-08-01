const router = require('express').Router();

const sensor = require('./sensors.controller');

router.post('/', sensor.createNewSensor);
router.get('/', sensor.getSensorById);
router.put('/settings', sensor.editSettings);
router.delete('/', sensor.deleteSensor);

module.exports = router