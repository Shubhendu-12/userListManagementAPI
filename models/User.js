// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  properties: { type: Map, of: String },
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
