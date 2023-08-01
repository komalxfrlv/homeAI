const router = require('express').Router();
const cities = require('./cities.controller');

router.get('/', cities.getAllCities);

module.exports = router;