// Centralized Express error-handling middleware
module.exports = (err, req, res, next) => {
  console.error('Error occurred in Backend:', err.stack || err);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};
