import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import userRoutes from './routes/userRoutes.js';
import connectToMongoDB from './db/connectToMongoDB.js';
import { app, server } from './socket/socket.js';

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Serve the frontend app's entry point for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// Connect to MongoDB and start the server
const startServer = async () => {
    try {
        await connectToMongoDB();
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
};

startServer();

