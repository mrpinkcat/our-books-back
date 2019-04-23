import { Response, Request } from 'express';
import models from '../models/index';
import bcrypt from 'bcrypt';
import config from '../env';
import uniqid from 'uniqid';

// User model
const User = models.User;

export default (req: Request, res: Response) => {
  console.log(req.body);
  if (req.body.username && req.body.password && req.body.firstName && req.body.lastName && req.body.birthDate) {
    bcrypt.hash(req.body.password, config.bcrypt.saltRounds)
    .then((hashedPassword) => {
      const token = uniqid.time('our-books-user-');
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthDate: new Date(parseInt(req.body.birthDate)),
        token,
      });
      user.save()
      .then((doc) => {
        console.log(doc);
        res.status(200).send({
          status: 'Created',
          token,
          doc,
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
    res.status(400).send({
      error: 'Body must contain username, password, firstName, lastName and birthDate in a timestamp format',
    });
  }
}
