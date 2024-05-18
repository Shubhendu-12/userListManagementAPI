const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()
const listRoutes = require('./routes/lists');
const userRoutes = require('./routes/users');


const app = express();
app.use(express.json());

const url = process.env.MONGOID;

mongoose.connect(url).then(() => {
  console.log('Connected to Mongo ATLAS');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

app.use('/lists', listRoutes);
app.use('/users', userRoutes);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });