const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception, shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<DB_PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful!');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`listeining on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('unhandeled rejection, shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
