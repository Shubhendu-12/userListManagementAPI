// routes/users.js
const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const List = require('../models/List');
const User = require('../models/User');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Add users via CSV upload
router.post('/add/:listId', upload.single('file'), async (req, res) => {
  const { listId } = req.params;
  const file = req.file;

  try {
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).send({ error: 'List not found' });
    }

    const results = [];
    const errors = [];
    let successCount = 0;
    let errorCount = 0;

    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        for (const row of results) {
          try {
            const { name, email, ...customProps } = row;

            if (!name || !email) {
              throw new Error('Name and email are required');
            }

            const existingUser = await User.findOne({ email, listId });
            if (existingUser) {
              throw new Error('Duplicate email');
            }

            const userProps = new Map();
            for (const [key, value] of Object.entries(customProps)) {
              userProps.set(key, value || list.customProperties.get(key));
            }

            const user = new User({ name, email, properties: userProps, listId });
            await user.save();
            successCount++;
          } catch (error) {
            errorCount++;
            errors.push({ row, error: error.message });
          }
        }

        fs.unlinkSync(file.path); // Remove the uploaded file

        res.status(200).send({
          message: 'User import completed',
          successCount,
          errorCount,
          errors,
          totalCount: await User.countDocuments({ listId })
        });
      });
  } catch (error) {
    res.status(400).send({ error: 'Error processing CSV', details: error.message });
  }
});

module.exports = router;

