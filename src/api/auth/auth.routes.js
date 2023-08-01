const router = require('express').Router();
const auth = require('./auth.controller');
const {isAuthenticated} = require('../../middlewares/auth.middleware')

router.post('/register', auth.register);

router.post('/login', auth.login);
router.post('/logout',isAuthenticated, auth.logoutUser);

router.post('/refreshToken', auth.refreshToken);

// This endpoint is only for demo purpose.
// Move this logic where you need to revoke the tokens( for ex, on password reset)
router.post('/revokeRefreshTokens', auth.revokeRefreshTokens);

module.exports = router;