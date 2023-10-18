const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(403).json({ message: 'Token is missing' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Token is invalid' });
      }
  
      req.userName = decoded.userName;
      next();
    });
  };

const generateToken = (userName) => {
    const token = jwt.sign({ userName }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

module.exports = { verifyToken, generateToken };
