import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { needAdminRank, needAuth } from './utils';
import routes from './routes';
import config from './env';

const app = express();
app.use(bodyParser.json());

// Route de heartbeat - C'est une route utilisé pour vérifier que l'API n'est pas down
app.get('/heartbeat', (req, res) => { res.sendStatus(200) });

// Route d'authentification
app.post('/auth', routes.auth);

// Route d'enregistrement
app.post('/register', routes.register);

// Route pour ajouter un livre
app.post('/addbook', needAdminRank, routes.addBook);

// Route pour chercher un livre
app.get('/books', needAuth, routes.searchBook);

console.log('Connection to mongodb...');
mongoose.connect(config.mongo.uri, { useNewUrlParser: true })
.then(() => {
  console.log('Connected to mongodb.');
  app.listen('3000');
  console.log('App started on :3000');
})
.catch((err) => {
  console.log('Connection to mongodb fail !');
  console.log(config.mongo.uri);
  console.log(err);
  process.exit();
});
