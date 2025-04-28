import express from 'express';
import Sitters from '../models/Sitters.js';

const router = express.Router();

// POST - Create a new sitter
router.post('/', async (req, res) => {
  try {
    const sitter = new Sitters(req.body);
    const savedSitter = await sitter.save();
    res.status(201).json(savedSitter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET - Get all sitters
router.get('/', async (req, res) => {
  try {
    const { locality, petType } = req.query;
    const filters = {};

    if (locality) {
      filters.locality = locality;
    }

    if (petType) {
      filters.petTypes = petType;
    }

    const sitters = await Sitters.find(filters);
    res.json(sitters);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Update order details
router.put('/:id', async (req, res) => {
  try {
    const updatedSitter = await Sitters.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSitter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;