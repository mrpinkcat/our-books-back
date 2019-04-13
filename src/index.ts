import express from 'express';
import mongoose from 'mongoose';
import routes from './routes';

const app = express();

app.post('/auth', routes.auth);

app.listen('3000').on('connection', () => {
  console.log('ok');
});