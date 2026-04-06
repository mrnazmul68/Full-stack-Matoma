const express = require('express');
const User = require('../models/User');
const { serializeUser } = require('../utils/serializeUser');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { bloodGroup = '', upozila = '' } = req.query;
    const query = {
      isDonor: 'donor',
      donated: false,
    };

    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }

    if (upozila) {
      query.upozila = upozila;
    }

    const donors = await User.find(query).sort({ updatedAt: -1 });

    return res.json({
      donors: donors.map(serializeUser),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
