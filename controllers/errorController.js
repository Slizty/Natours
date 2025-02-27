const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDupFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: '${value}'. Please use another value!`;
  return new AppError(message, 404);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => message);
  const message = `Invalid input data ${errors.join(', ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
    // Rendered Website
  } else
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    //Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //proggraming or other unknown error
    // 1)Log Error
    console.error('Error', err);
    return res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });

    // For rendered website
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'something went wrong!',
      msg: err.message,
    });
    //proggraming or other unknown error
  }
  // 1)Log Error
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again in 2030',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDupFieldsDB(error);
    if (err.name === 'validationError') error = handleValidationErrorDB(error);

    console.log(err.message);
    console.log(error.message);
    sendErrorProd(error, req, res);
  }
};
