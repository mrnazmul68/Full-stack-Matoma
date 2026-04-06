const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const { serializeUser } = require('../utils/serializeUser');

const router = express.Router();

router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.json({
      user: serializeUser(user),
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const {
      name,
      isDonor,
      upozila,
      mobile,
      bloodGroup,
      age,
      photo,
      donated,
      lastDonationDate,
    } = req.body;

    user.name = typeof name === 'string' ? name.trim() : user.name;
    user.isDonor = typeof isDonor === 'string' ? isDonor : user.isDonor;
    user.upozila = typeof upozila === 'string' ? upozila.trim() : user.upozila;
    user.mobile = typeof mobile === 'string' ? mobile.trim() : user.mobile;
    user.bloodGroup = typeof bloodGroup === 'string' ? bloodGroup.trim() : user.bloodGroup;
    user.age = age === '' || age === null || typeof age === 'undefined' ? null : Number(age);
    user.photo = typeof photo === 'string' ? photo : user.photo;
    user.donated = typeof donated === 'boolean' ? donated : user.donated;
    user.lastDonationDate = lastDonationDate || null;

    if (!user.name) {
      return res.status(400).json({
        message: 'Name is required before you can leave your profile.',
      });
    }

    if (!['donor', 'non-donor'].includes(user.isDonor)) {
      return res.status(400).json({
        message: 'Please select donor or non-donor before continuing.',
      });
    }

    if (user.isDonor !== 'donor') {
      user.upozila = '';
      user.mobile = '';
      user.bloodGroup = '';
      user.age = null;
      user.donated = false;
      user.lastDonationDate = null;
    }

    if (
      user.isDonor === 'donor' &&
      (!user.name || !user.bloodGroup || !user.upozila || !user.mobile || !user.age)
    ) {
      return res.status(400).json({
        message: 'Name, blood group, upazila, mobile, and age are required for donors.',
      });
    }

    await user.save();

    return res.json({
      message: 'Profile updated successfully.',
      user: serializeUser(user),
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
