import { Response, Request } from 'express';
import models from '../models/index';
import bcrypt from 'bcrypt';
import config from '../env';
import uniqid from 'uniqid';
import { checkTokenAdmin } from '../utils';

// User model
const User = models.User;

export default (req: Request, res: Response) => {
  console.log(req.body);
  if (req.body.username && req.body.password && req.body.fullName && req.body.birthDate) {
    // Si la requete contient le rank admin
    if (req.body.rank === 'admin') {
      if (req.query.token) {
        checkTokenAdmin(req.query.token)
        .then((admin) => {
          if (admin) {
            bcrypt.hash(req.body.password, config.bcrypt.saltRounds)
            .then((hashedPassword) => {
              const token = uniqid.time('our-books-user-');
              const user = new User({
                username: req.body.username,
                password: hashedPassword,
                fullName: req.body.fullName,
                birthDate: new Date(parseInt(req.body.birthDate)),
                rank: req.body.rank,
                token,
              });
              user.save()
              .then((doc) => {
                console.log(doc);
                res.status(200).send({
                  status: 'Created',
                  token,
                });
              })
              .catch((err) => {
                res.status(500).send(err);
              });
            })
            .catch((err) => {
              res.status(500).send(err);
            });
          } else {
            res.status(401).send({
              error: 'You aren\'t admin ! GET OUT !',
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            error: err,
          });
        });
      } else {
        res.status(401).send({
          error: 'Missing \'token\' param',
        });
      }
    } else {
      bcrypt.hash(req.body.password, config.bcrypt.saltRounds)
      .then((hashedPassword) => {
        const token = uniqid.time('our-books-user-');
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
          fullName: req.body.fullName,
          birthDate: new Date(parseInt(req.body.birthDate)),
          token,
        });
        user.save()
        .then((doc) => {
          console.log(doc);
          res.status(200).send({
            status: 'Created',
            token,
          });
        })
        .catch((err) => {
          res.status(500).send(err);
        });
      })
      .catch((err) => {
        res.status(500).send(err);
      });
    }
  } else {
    res.status(400).send({
      error: 'Body must contain username, password, fullName and birthDate in a string timestamp format',
    });
  }
}
