const express = require('express');
const QRCode = require('qrcode');
const Outpass = require('../models/Outpass');
const { protect, restrictTo } = require('../middleware/auth');
const router = express.Router();

router.post('/create', protect, restrictTo('student'), async (req, res) => {
  const { reason, parentId } = req.body;
  try {
    const outpass = new Outpass({
      studentId: req.user.id,
      parentId,
      reason
    });
    await outpass.save();
    res.status(201).json(outpass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/all', protect, restrictTo('admin'), async (req, res) => {
  try {
    const outpasses = await Outpass.find().populate('studentId parentId');
    res.json(outpasses);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id/parent-approve', protect, restrictTo('parent'), async (req, res) => {
  try {
    const outpass = await Outpass.findById(req.params.id);
    if (!outpass) return res.status(404).json({ error: 'Outpass not found' });
    if (outpass.parentId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    outpass.status = 'approved';
    outpass.approvedAt = new Date();
    outpass.qrCode = await QRCode.toDataURL(`Outpass:${outpass._id}`);
    await outpass.save();

    res.json(outpass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/:id/status', protect, restrictTo('admin'), async (req, res) => {
  const { status } = req.body;
  try {
    const outpass = await Outpass.findById(req.params.id);
    if (!outpass) return res.status(404).json({ error: 'Outpass not found' });

    outpass.status = status;
    if (status === 'approved') {
      outpass.approvedAt = new Date();
      outpass.qrCode = await QRCode.toDataURL(`Outpass:${outpass._id}`);
    }
    await outpass.save();

    res.json(outpass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id/qr', protect, async (req, res) => {
  try {
    const outpass = await Outpass.findById(req.params.id);
    if (!outpass) return res.status(404).json({ error: 'Outpass not found' });
    if (outpass.studentId.toString() !== req.user.id && outpass.parentId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }
    res.json({ qrCode: outpass.qrCode });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;