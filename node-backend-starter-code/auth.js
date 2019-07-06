const jwt = require('jwt-simple'),
    moment = require('moment');
const dotenv = require('dotenv');
dotenv.config();
const TOKEN_CODE = process.env.TOKEN_CODE;

module.exports = {
  /*
  * Login Required Middleware
  */
  ensureAuthenticated: function (req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).send({ message: 'Please make sure your request has an Authorization header.' });
    }

    let token = req.headers.authorization.split(' ')[1];
    let payload = null;

    try {
      payload = jwt.decode(token, process.env.TOKEN_CODE || TOKEN_CODE);
    }
    catch (err) {
      return res.status(401).send({ message: err.message });
    }
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({ message: 'Token has expired.' });
    }
    req.user = payload.sub;
    next();
  },

  /*
  * Generate JSON Web Token
  */
  createJWT: function (user) {
    let payload = {
      sub: user.id,
      iat: moment().unix(),
      exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, process.env.TOKEN_CODE || TOKEN_CODE);
  }
};
