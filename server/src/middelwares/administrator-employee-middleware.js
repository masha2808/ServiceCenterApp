const jwt = require('jsonwebtoken');

const administratorEmployeeMiddleware = (req, res, next) => {
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
    if (tokenPayload.role === "administrator" || tokenPayload.role === "employee") {
      req.user = tokenPayload;
      next();
    } else {
      throw new Error("Користувач не має прав адміністратора або працівника");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  administratorEmployeeMiddleware
};
