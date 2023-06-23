const jwt = require('jsonwebtoken');

const authenticationMiddleware = (req, res, next) => {
  const {
    authorization
  } = req.headers;

  if (!authorization) {
    return res.status(400).json({ message: 'Please, provide "authorization" header' });
  }

  const [, token] = authorization.split(' ');

  if (!token) {
    return res.status(400).json({ message: 'Please, include token to request' });
  }

  try {
    const tokenPayload = jwt.verify(token, 'secret');
    req.user = tokenPayload;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  authenticationMiddleware
};
