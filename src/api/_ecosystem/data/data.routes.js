const router = require('express').Router();
const data = require('./data.controller');
const { isAuthenticated } = require('../../../middlewares/auth.middleware');

router.post('/', data.create);

router.get('/', isAuthenticated, data.getInterval);

module.exports = router;