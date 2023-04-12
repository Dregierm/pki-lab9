require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const resourceRouter = require('./routes/resource');

const app = express();

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/resource', resourceRouter);

const port = process.env.port || 3000
app.listen(port, () => console.log(`Server running at ${port}`));