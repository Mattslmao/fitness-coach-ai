const User = require('../models/User');

module.exports = async function(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    
    if (!user || user.subscription.plan !== 'premium' || user.subscription.status !== 'active') {
      return res.status(403).json({ 
        message: 'Premium subscription required',
        requiresUpgrade: true
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};