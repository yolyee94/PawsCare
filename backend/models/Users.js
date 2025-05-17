import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  resetToken: {
    type: String,
    required: false
  },
  resetTokenExpiry: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);