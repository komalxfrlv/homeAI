const router = require('express').Router();
const {
    addGroup,
    getGroups,
    postUserToGroup
} = require('./userGroups.controller');

const { isAuthenticated } = require('../../../middlewares/auth.middleware');
const { isAdmin } = require('../../../middlewares/role.middleware');

router.get('/', isAuthenticated, isAdmin, getGroups)
router.post('/', isAuthenticated, isAdmin, addGroup);
router.post('/addUser', isAuthenticated, postUserToGroup);

module.exports = router