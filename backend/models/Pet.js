import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  breed: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    required: false
  },
  locality: {
    type: String,
    required: false
  },
  vaccination: {
    type: String,
    required: false
  },
  image: {
    type: String, // base64 string or URL
    required: false
  },
  vaccinationDoc: {
    type: String, // base64 string, URL, or file name
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Pet', petSchema);