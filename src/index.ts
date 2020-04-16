import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { needAdminRank, needAuth, addAuthorBook } from './utils';
import routes from './routes';
import config from './env';
import cors from 'cors';
import https from 'https';
import fs from 'fs';

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

// Créer un token temporaire avec une expiration de 3 jours, à chaque
// fois qu'il y a une requette, renvoyer le token dedans. Quand ce token
// est invalide refuser l'acces. Si ce token est valide, regener un nouveau
// token de nouveau valide pour 3 jours. Ça evite de stoquer les
// credidentials dans les cookies

// Route de heartbeat - Utilisé pour vérifier que l'API n'est pas down
app.get('/heartbeat', (req, res) => { res.sendStatus(200) });

// Route d'authentification - Utilisé pour l'obtention de token
app.post('/auth', routes.auth);

// Route d'authentification - Utilisé pour l'obtention de token
app.get('/auth/:token', routes.checkAuth);

// Route d'enregistrement
app.post('/register', routes.register);

// Route pour ajouter un livre
app.post('/books/:isbn', needAdminRank, routes.addBook);

// Route pour chercher un livre
app.get('/books', routes.searchBook);

// Route pour chercher un livre
app.delete('/books/:isbn', needAdminRank, routes.deleteBook);

// Route pour ajouter une bibiliothèque
app.post('/libraries', needAdminRank, routes.addLibrary);

// Route pour chercher une bibiliothèque
app.get('/libraries', routes.library);

// Route pour emprunter un livre
app.post('/borrow', needAuth, routes.borrow);

// Route pour rendre un livre
app.post('/return', needAdminRank, routes.retrunBook);

// Route pour chercher les categories
app.get('/categories', routes.searchCategorie);

// Route pour changer la bibiliothèque d'un utlisateur
app.post('/user/library', needAuth, routes.changeUserLibrary);

// IDEA : /ask/:isbn # For ask to add a book

console.log('Connection to mongodb...');
mongoose.connect(config.mongo.uri, { useNewUrlParser: true, useCreateIndex: true })
.then(() => {
  console.log('Connected to mongodb.');
  if (process.env.HTTPS) {
    console.log('Checking tls files ...');

    if (!fs.existsSync('key.pem')) {
      console.error(`Key not found key.pem`);
      process.exit(1);
    }
    if (!fs.existsSync('certchain.pem')) {
      console.error(`Certificate not found certchain.pem`);
      process.exit(1);
    }

    console.log('tls files OK');

    const privateKey  = fs.readFileSync('key.pem', 'utf8');
    const certificate = fs.readFileSync('certchain.pem', 'utf8');

    const credentials = {key: privateKey, cert: certificate};

    https.createServer(credentials, app).listen(process.env.PORT, () => {
      console.log(`App started on :${process.env.PORT} with HTTPS`);
    });
  } else {
    app.listen(process.env.PORT, () => {
      console.log(`App started on :${process.env.PORT} without HTTPS`);
    });
  }
})
.catch((err) => {
  console.log('Connection to mongodb fail !');
  console.log(config.mongo.uri);
  console.log(err);
  process.exit();
});
