const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const UserDB = require('../models/user');


function verify(roles) {
   return (req, res, next) => {
      const authHeader = req.headers['authorization'];
      const token = authHeader?.split(' ')[1] || req.cookies.accessToken;
      if (token == null) {
        return res.sendStatus(401); 
      }
      
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          //no longer valid token
          return res.status(403).redirect("../auth/logout");
        }

        if( !roles.includes(user.role) ) {
          return res.status(403).render('error', { message: "Access denied" });
        }

        req.user = user;
        next();
      });
   }
}

router.get('/public', function(req, res, next) {
  res.send('Public resource');
});

router.get('/user', verify(['user', 'admin']), function(req, res, next) {
  res.render('user', { user: req.user });
});

router.get('/admin',  verify(['admin']), async function(req, res, next) {
  let users = [];

  try {
    for await (let user of UserDB.find()) {
      users.push(user);
    }  
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }

  res.render('admin', {users: users});
});

module.exports = router;
