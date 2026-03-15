import express from 'express';
import dotenv from 'dotenv';
import ConnectMongo from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import { notFound, errorHandler } from './middlware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/upload.js';
import path from 'path';
import morgan from 'morgan';

dotenv.config();
ConnectMongo();

const app = express();

// Dev logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());

// API routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// __dirname points to backend/, so go up one level to access frontend
const __dirname = path.resolve();

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve React build
app.use(express.static(path.join(__dirname, './frontend/build')));

// Catch all other routes and serve React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/build', 'index.html'));
});

// Error middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);