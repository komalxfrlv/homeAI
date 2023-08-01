const router = require('express').Router();
const shelldues = require('./shelldues.controller')
const { isAuthenticated } = require('../../middlewares/auth.middleware')

router.get('/station/:stationId', shelldues.getShelldueForStation);
router.get('/user', shelldues.getAllShellduesOfUser);
router.get('/shelldue/:shelldueId', shelldues.getShelldue);

router.post('/', shelldues.addNewShelldue);

router.put('/shelldue/:shelldueId', shelldues.updateShelldue);

router.delete('/shelldue/:shelldueId', shelldues.deleteShelldue);

module.exports = router;