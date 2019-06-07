import { Response, Request } from 'express';
import models from '../models/index';

const Library = models.Library;

export default (req: Request, res: Response) => {
  console.log(req.query.q)
  console.log(`Get /libraries${req.query.q ? `?q=${req.query.q}` : ''}`)
  if (req.query.q) {
    Library.find({ $text: { $search: req.query.q} })
    .then((docs) => {
      if (docs.length > 0) {
        res.status(200).send(docs);
      } else {
        res.status(404).send({
          error: `No result for ${req.query.q}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  } else {
    Library.find().limit(10)
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
}