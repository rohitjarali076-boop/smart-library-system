const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify token
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Not authorized to access this route. Token missing.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    if (req.user.membershipStatus === 'SUSPENDED') {
      return res.status(403).json({
        status: 'fail',
        message: 'Your account has been suspended. Contact library admin.'
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: 'Not authorized to access this route. Invalid token.'
    });
  }
};

// Authorize roles (e.g., ADMIN, LIBRARIAN)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: `User role '${req.user.role}' is not authorized to perform this action.`
      });
    }
    next();
  };
};
