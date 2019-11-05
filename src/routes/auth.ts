import { Response, Request } from 'express';
import models from '../models/index';
import bcrypt from 'bcrypt';

const User = models.User;

export default (req: Request, res: Response) => {
  console.log(`Auth: ${req.body.username}`);
  if (req.body.username && req.body.password) {
    User.findOne({ username: req.body.username }).then((doc) => {
      if (doc) {
        const resDoc = (doc.toJSON() as { rank: string, _id: string, username: string, password: string, fullName: string, birthDate: string, token: string, libraryId: string, __v: number });
        delete resDoc.__v;
        delete resDoc._id;
        delete resDoc.password;
        bcrypt.compare(req.body.password, doc.toJSON().password)
        .then((same) => {
          if (same) {
            const token = doc.toJSON().token;
            res.status(200).send({
              status: 'Success',
              userInfo: resDoc,
            });
          } else {
            res.status(401).send({
              error: 'Incorrect password',
              field: 'password',
            })
          }
        })
        .catch((err) => {
          res.status(400).send(err);
        });
      } else {
        res.status(403).send({
          error: 'Incorrect username',
          field: 'username',
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
