const router = require('express').Router();

const metrics = require('./metrics/metrics.routes');
const cities = require('./cities/cities.routes');
const devices = require('./devices/devices.routes');
const versions = require('./versions/versions.routes');
const sensors = require('./sensors/sensors.routes');
const stations = require('./stations/stations.routes');
const data = require('./data/data.routes');
const userGroups = require("./userGroups/userGroups.routes")
const { isAuthenticated } = require('../../middlewares/auth.middleware');
const {
    isAdmin,
    isManager,
    isDeveloper,
    isSupport
  } = require('../../middlewares/role.middleware');

router.use('/cities', cities);
router.use('/metrics', metrics);
router.use('/devices', isDeveloper, devices);
router.use('/versions', versions);
router.use('/sensors', sensors);
router.use('/stations', stations);
router.use('/data', data);
router.use('/user-groups', userGroups);
module.exports = router;