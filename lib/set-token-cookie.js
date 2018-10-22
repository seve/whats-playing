const jwt = require('jsonwebtoken');
module.exports = function(res, user) {
  const token = jwt.sign(
    {
      _id: user._id,
      username: user.username
    },
    process.env.HASH_SECRET,
    {
      expiresIn: '60 days'
    }
  );
  res.cookie('whatsPlayingToken', token, {
    maxAge: 2592000000, // 30 days in ms
    httpOnly: true
  });
};
