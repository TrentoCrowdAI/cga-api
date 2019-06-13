const dummyUser = {id: '123123123123123',name: 'John',surname: 'Doe'};

const isLoggedIn = (req, res, next) => {
  if(process.env.NODE_ENV === 'test'){
    req.session = req.session || {};
    req.session.user = dummyUser;
  }else{
    console.log(req.session);
  }
  if (req.session && req.session.user !== undefined) {
    next();
  } else {
    res.status(400).json('User not authenticated');
  }
} 

const isLoggedInWithAdminCheck = (req, res, next) => {
  if(process.env.NODE_ENV === 'test'){
    req.session = req.session || {};
    req.session.user = dummyUser;
  }else{
    console.log(req.session);
  }
  if (req.session && req.session.user !== undefined) {
    next();
  } else {
    res.status(400).json('User not authenticated');
  }
}

module.exports = {isLoggedIn, isLoggedInWithAdminCheck};