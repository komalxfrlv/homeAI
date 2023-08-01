const router = require('express').Router();
const { isAuthenticated } = require('../../../middlewares/auth.middleware');
const device = require('./devices.controller');


router.get('/', isAuthenticated, device.getAllDevices);
router.post('/', isAuthenticated, device.addDevice);

module.exports = router;