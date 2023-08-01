const jwt = require('jsonwebtoken');

const { findUserById } = require('../api/users/users.services');

async function getCurrentUser(headers) {
    const { authorization } = headers;

    const token = authorization.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    var userId = decoded.user_data.user_id;

    var user = await findUserById(userId)

    delete user.password;
    
    return user;
}

module.exports = {
    getCurrentUser
}