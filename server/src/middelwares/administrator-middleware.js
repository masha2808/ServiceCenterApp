const jwt = require('jsonwebtoken');

const administratorMiddleware = (req, res, next) => {
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
    if (tokenPayload.role === "administrator") {
      req.user = tokenPayload;
      next();
    } else {
      throw new Error("Користувач не має прав адміністратора");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  administratorMiddleware
};
