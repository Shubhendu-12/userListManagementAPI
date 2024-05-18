// routes/lists.js
const express = require('express');
const List = require('../models/List');
const User = require('../models/User');
const sendEmail = require('../utils/email');
const router = express.Router();

// Create a new list
router.post('/create', async (req, res) => {
  try {
    const { title, customProperties } = req.body;
    const list = new List({ title, customProperties });
    await list.save();
    res.status(201).send({ message: 'List created successfully', list });
  } catch (error) {
    res.status(400).send({ error: 'Error creating list', details: error.message });
  }
});

// Send email to all users in a list
router.post('/send-email/:listId', async (req, res) => {
  const { listId } = req.params;
  const { subject, body } = req.body;

  try {
    const users = await User.find({ listId });

    users.forEach(user => {
      let personalizedBody = body;
      for (const [key, value] of user.properties.entries()) {
        personalizedBody = personalizedBody.replace(`[${key}]`, value);
      }
      sendEmail(user.email, subject, personalizedBody);
    });

    res.status(200).send({ message: 'Emails sent successfully' });
  } catch (error) {
    res.status(400).send({ error: 'Error sending emails', details: error.message });
  }
});

module.exports = router;
