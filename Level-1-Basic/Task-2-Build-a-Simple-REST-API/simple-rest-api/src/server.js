import express from 'express';
import taskRoutes from './routes/taskRoutes.js';

// Initialize Express Application
const app = express();

// Middleware for JSON body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Simple REST API is running successfully',
  });
});

// Register Task API Routes
app.use('/api/tasks', taskRoutes);

// Handle Invalid / Undefined Routes (404 Not Found)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Global Error Handler Middleware (500 Server Error)
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.stack || err.message);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
});

// Server Configuration
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Simple REST API Server running on port ${PORT}`);
  console.log(`🌐 Base API Endpoint: http://localhost:${PORT}/api/tasks`);
  console.log(`===============================================`);
});

export default app;
