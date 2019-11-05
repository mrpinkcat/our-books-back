import { ObjectID } from 'bson';
import { Response, Request } from 'express';
import models from '../models/index';

const User = models.User;

export default (req: Request, res: Response) => {
  console.log(`POST /user/library`);
  if (req.body.libraryId) {
    User.updateOne({ token: res.locals.token }, { libraryId: req.body.libraryId })
    .then(() => {
      res.status(200).send({ sucess: true });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  } else {
    res.status(400).send({
      error: 'Body must contain \'libraryId\'',
    });
  }
}