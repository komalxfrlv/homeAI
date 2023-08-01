const jwt = require('jsonwebtoken');

function isAuthenticated(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401);
    return res.json({ error: 'Unauthorized' });
  }

  try {
    const token = authorization.split(' ')[1];

    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.payload = payload;
  } catch (err) {

    res.status(401);

    console.log(err);

    res.json({ error: err.name });

  }

  return next();
}

module.exports = {
  isAuthenticated
}