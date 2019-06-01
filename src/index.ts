import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { needAdminRank, needAuth } from './utils';
import routes from './routes';
import config from './env';

const app = express();
app.use(bodyParser.json());

// Route de heartbeat - Utilisé pour vérifier que l'API n'est pas down
app.get('/heartbeat', (req, res) => { res.sendStatus(200) });

// Route d'authentification - Utilisé pour l'obtention de token
app.post('/auth', routes.auth);

// Route d'enregistrement
app.post('/register', routes.register);

// Route pour ajouter un livre
app.post('/books/:isbn', needAdminRank, routes.addBook);

// Route pour chercher un livre
app.get('/books', needAuth, routes.searchBook);

// Route pour ajouter une bibiliothèque
app.post('/libraries', needAdminRank, routes.addLibrary);

// Route pour chercher une bibiliothèque
app.get('/libraries', needAuth, routes.searchLibrary);

// Route pour emprunter un livre
app.post('/borrow', needAuth, routes.borrow);

console.log('Connection to mongodb...');
mongoose.connect(config.mongo.uri, { useNewUrlParser: true, useCreateIndex: true })
.then(() => {
  console.log('Connected to mongodb.');
  app.listen(process.env.PORT, () => {
    console.log(`App started on :${process.env.PORT}`);
  });
})
.catch((err) => {
  console.log('Connection to mongodb fail !');
  console.log(config.mongo.uri);
  console.log(err);
  process.exit();
});
