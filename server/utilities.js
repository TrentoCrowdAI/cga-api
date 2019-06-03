const isLoggedIn = (req, res, next) => {
  console.log(req.session);
  if (req.session && req.session.user !== undefined) {
    next();
  } else {
    res.status(400).json('User not authenticated');
  }
} 

module.exports = {isLoggedIn};