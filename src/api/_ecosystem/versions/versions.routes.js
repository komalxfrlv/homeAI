const router = require('express').Router();
const version = require('./versions.controller');
const {
    isAdmin,
    isManager,
    isDeveloper,
    isSupport
  } = require('../../../middlewares/role.middleware');

router.post('/', version.createNewVersion);
router.get('/', version.getAllVersion);
router.get('/download', version.downloadNewVersion);
//router.post('/upload', isDeveloper, version.uploadNewVersion);

module.exports = router