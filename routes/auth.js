const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const UserDB = require('../models/user');

const router = express.Router();

function sign(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10min'});
}

router.post('/signin', async function(req, res, next) {
  let loggedUser;
  try {
    loggedUser = await UserDB.findOne({ name: req.body.name });
    if(loggedUser == null) {
      return res.status(401).render('error', { message: 'Incorrect data' });
    }
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }

  try {
    if(! await bcrypt.compare(req.body.password, loggedUser.password)) {
      return res.status(401).render('error', { message: 'Incorrect password' });
    }
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }

  try {
    loggedUser.counter += 1;
    loggedUser.lastvisit = Date.now();
    await loggedUser.save();
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
  
  const user = {
    name: loggedUser.name,
    role: loggedUser.role
  };
  
  const accessToken = sign(user);
  res.cookie('accessToken', accessToken);
  res.json({ accessToken: accessToken });
});

router.post('/signup', async function(req, res, next) {
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(req.body.password, 10);
  } catch (error) {
    res.status(500).render('error', { message: error.message });
  }
  
  const signUser = new UserDB({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: 'user'
  });

  try {
    const newUser = await signUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).render('error', { message: error.message });
  }

});

router.get('/signin', function(req, res, next) {
  res.render('signin');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/logout', function(req, res, next) {
  res.clearCookie('accessToken');
  res.redirect('/');
});

module.exports = router;
