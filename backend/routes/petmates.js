import express from 'express';
import Pet from '../models/Pet.js';


const router = express.Router();

// POST - Create a new customer
router.post('/', async (req, res) => {
  try {
    const petmates = new Pet(req.body);
    const savedPetMates = await petmates.save();
    res.status(201).json(savedPetMates);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// // GET - Get all contacts
// router.get('/', async (req, res) => {
//   try {
//     const petmates = await PetMates.find();
//     res.json(petmates);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// GET - Get contacts based on query parameters (with pagination for no query params)
router.get('/', async (req, res) => {
  const query = {};
  const limit = 30; // Define the default limit

  if (req.query.type) {
    query.type = req.query.type;
  }
  if (req.query.breed) {
    query.breed = req.query.breed;
  }
  if (req.query.gender) {
    query.gender = req.query.gender;
  }
  if (req.query.locality) {
    query.locality = { $regex: new RegExp(req.query.locality, 'i') }; // Case-insensitive search
  }

  try {
    let petmates;
    if (Object.keys(query).length === 0) {
      // No query parameters provided, fetch the top 30
      petmates = await Pet.find().limit(limit);
    } else {
      // Query parameters provided, filter the results
      petmates = await Pet.find(query);
    }
    res.json(petmates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// GET - Get all distinct locations
router.get('/localities', async (req, res) => {
  try {
    const distinctLocations = await Pet.distinct('location');
    res.json(distinctLocations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET - Get all distinct breeds (optionally filtered by petType)
router.get('/breeds', async (req, res) => {
  try {
    let query = {};
    if (req.query.petType) {
      query.petType = req.query.petType;
    }
    const distinctBreeds = await Pet.distinct('breed', query);
    res.json(distinctBreeds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Update contact details
router.put('/:id', async (req, res) => {
  try {
    const updatedPetMates = await Pet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPetMates);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;