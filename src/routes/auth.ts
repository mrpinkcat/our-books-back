import { Response, Request } from 'express';
import models from '../models/index';
import bcrypt from 'bcrypt';

const User = models.User;

export default (req: Request, res: Response) => {
  console.log('Auth')
  if (req.body.username && req.body.password) {
    User.findOne({ username: req.body.username }).then((doc) => {
      if (doc) {
        bcrypt.compare(req.body.password, doc.toJSON().password)
        .then((same) => {
          if (same) {
            const token = doc.toJSON().token;
            res.status(200).send({
              status: 'Success',
              token,
            });
          } else {
            res.status(401).send({
              error: 'Incorrect password',
              type: 'password',
            })
          }
        })
        .catch((err) => {
          res.status(400).send(err);
        });
      } else {
        res.status(403).send({
          error: 'Incorrect username',
          type: 'username',
        });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  } else {
    res.status(400).send({
      error: 'Body must contain username and password',
    });
  }
}
