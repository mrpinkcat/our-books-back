import express from 'express';
import mongoose from 'mongoose';
import routes from './routes';
import config from './env';

const app = express();

app.post('/auth', routes.auth);

console.log('Connection to mongodb...')
mongoose.connect(config.mongo.uri, { useNewUrlParser: true })
.then(() => {
  console.log('Connected to mongodb.');
  app.listen('3000');
})
.catch((err) => {
  console.log('Connection to mongodb fail !');
  console.log(config.mongo.uri);
  console.log(err);
  process.exit();
});
