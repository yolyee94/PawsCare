import mongoose from 'mongoose';

const walkerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  locality: {
    type: String,
    required: false
  },
  experience: {
    type: Number,
    required: false
  },
  petTypes: {
    type: Array,
    required: false
  },
  schedule:{
    type: Array,
    required: false
  },
  rating: {
    type: Number,
    required: false
  },
  reviews: {
    type: Array,
    required: false
  },
  bio: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Walkers', walkerSchema);

// {
//   "id": "w1745732280765",
//   "name": "sain",
//   "phone": "881812282182",
//   "email": "sainandanpai@gmail.com",
//   "locality": "suburb",
//   "experience": "2",
//   "petTypes": [
//       "cat"
//   ],
//   "bio": "i am me",
//   "photo": "images/default-avatar.jpg"
// }