import { Response, Request } from 'express';
import models from '../models/index';

const Library = models.Library;

export default (req: Request, res: Response) => {
  console.log(`Get /libraries`);
  Library.find()
  .then((docs) => {
    if (docs.length > 0) {
      res.status(200).send(docs);
    } else {
      res.status(400).send({
        error: 'No library in the data base'
      })
    }
  })
  .catch((err) => {
    res.status(500).send(err);
  });
}