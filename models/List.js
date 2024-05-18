// models/List.js
const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  customProperties: { type: Map, of: String }
});

const List = mongoose.model('List', listSchema);

module.exports = List;
