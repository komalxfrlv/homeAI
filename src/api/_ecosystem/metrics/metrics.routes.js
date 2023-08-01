const router = require('express').Router();
const metrics = require('./metrics.controller');

router.post('/', metrics.createNewMetric);

module.exports = router