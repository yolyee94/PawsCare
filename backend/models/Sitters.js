import mongoose from 'mongoose';

const sitterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
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
  rating: {
    type: Number,
    required: false
  },
  reviews: {
    type: Array,
    required: false
  },
  about: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Sitters', sitterSchema);