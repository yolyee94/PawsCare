import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import customerRoutes from './routes/customers.js';
import orderRoutes from './routes/orders.js';
import contactRoutes from './routes/contacts.js';
import petmateRoutes from './routes/petmates.js';
import sitterRoutes from './routes/sitter.js';
import walkerRoutes from './routes/walker.js';
import userRoutes from './routes/users.js';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();

// Configure CORS
const corsOptions = {
  origin: '*', // Allow all origins during development
  methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'], // Allow common HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Apply CORS with options
app.use(cors(corsOptions));

// Configure body parser middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/petmates', petmateRoutes);
app.use('/api/sitter', sitterRoutes);
app.use('/api/walker', walkerRoutes);
app.use('/api/user', userRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});