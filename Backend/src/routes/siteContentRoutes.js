const express = require('express');
const SiteContent = require('../models/SiteContent');
const { requireAdmin } = require('../middleware/requireAdmin');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const siteContent = await SiteContent.findOne({ key: 'main' });

    return res.json({
      content: siteContent?.content || {},
    });
  } catch (error) {
    next(error);
  }
});

router.put('/', requireAdmin, async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || typeof content !== 'object' || Array.isArray(content)) {
      return res.status(400).json({
        message: 'A valid site content object is required.',
      });
    }

    const siteContent = await SiteContent.findOneAndUpdate(
      { key: 'main' },
      { key: 'main', content },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.json({
      message: 'Site content updated successfully.',
      content: siteContent.content,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
