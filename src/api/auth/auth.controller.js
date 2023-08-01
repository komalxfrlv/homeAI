const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { generateTokens } = require('../../utils/jwt');
const { hashToken } = require('../../utils/hashToken');
const { postPushReq } = require("../../utils/pusher");
const { postEmailReq } = require('../../utils/mailer')

const {
    findUserByEmail,
    createUser,
    findUserById
} = require('../users/users.services');

const userValidator = require('../users/users.validators');

const {
    addRefreshTokenToWhitelist,
    findRefreshTokenById,
    deleteRefreshToken,
    revokeTokens,
    logout
} = require('./auth.services');

async function register(req, res, next) {
    try { 
        let newUser = req.body;

        if (! await userValidator.validateUserCreating(newUser)) {
            res.status(400);
            throw new Error('You must provide all fields of User.');
        }

        const existingUser = await findUserByEmail(newUser.email);

        if (existingUser) {
            res.status(400);
            throw new Error('Email already in use.');
        }

        const user = await createUser(newUser);
        const jti = uuidv4();
        const { accessToken, refreshToken } = generateTokens(user, jti);
        await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id });
        /*
        const message = "please work"
        await sendMessage(process.env.MAIL_USER, message, newUser.email)
        */
       const link = `http://${process.env.APP_HOST}:${process.env.APP_PORT}/api/users/verify/${user.email}`
        //const content = `<a href=${link}>Hello there!</a>`
       await postEmailReq(user.email, link, "registration")
       res.json({
            accessToken,
            refreshToken
        });
    } catch (err) {
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400);
            throw new Error('You must provide an email and a password.');
        }

        const existingUser = await findUserByEmail(email);

        if (!existingUser) {
            res.status(403);
            throw new Error('Invalid login credentials.');
        }

        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) {
            res.status(403);
            throw new Error('Invalid login credentials.');
        }

        const jti = uuidv4();
        const { accessToken, refreshToken } = generateTokens(existingUser, jti);
        await addRefreshTokenToWhitelist({ jti, refreshToken, userId: existingUser.id });
        res.json({
            accessToken,
            refreshToken
        });
    } catch (err) {
        next(err);
    }
}

async function logoutUser(req, res, next){
    try{
        const token = req.body.token 
        if(!token){
            throw new Error(`Can't find token in req`)
        }
        const user = await findUserById(req.payload.userId)
        let tokensArr = user.token
        tokensArr.splice(user.token.indexOf(token), 1)
        await logout(user)
        res.json('DONE!')
    }
    catch(err){
        next(err)
    }
}

async function refreshToken(req, res, next) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400);
            throw new Error('Missing refresh token.');
        }
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const savedRefreshToken = await findRefreshTokenById(payload.jti);

        if (!savedRefreshToken || savedRefreshToken.revoked === true) {
            res.status(401);
            throw new Error('Unauthorized');
        }

        const hashedToken = hashToken(refreshToken);
        if (hashedToken !== savedRefreshToken.hashedToken) {
            res.status(401);
            throw new Error('Unauthorized');
        }

        const user = await findUserById(payload.userId);
        if (!user) {
            res.status(401);
            throw new Error('Unauthorized');
        }

        await deleteRefreshToken(savedRefreshToken.id);
        const jti = uuidv4();
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user, jti);
        await addRefreshTokenToWhitelist({ jti, refreshToken: newRefreshToken, userId: user.id });

        res.json({
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (err) {
        next(err);
    }
}

async function revokeRefreshTokens(req, res, next) {
    try {
        const { userId } = req.body;
        await revokeTokens(userId);
        res.json({ message: `Tokens revoked for user with id #${userId}` });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    register,
    login,
    refreshToken,
    revokeRefreshTokens,
    logoutUser
}