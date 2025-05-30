const express = require('express');
const router = express.Router();
const { Notification } = require('../db/mongo');

router.get('/:userId', async (req, res) => {
  try {
    const notifs = await Notification.find({ user_id: req.params.userId }).sort({ timestamp: -1 });
    res.json(notifs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching notifications');
  }
});

module.exports = router;