import { Response, Request } from 'express';
import models from '../models/index';

const Book = models.Book;

export default (req: Request, res: Response) => {
  if (req.query.q) {
    Book.find({ $text: { $search: req.query.q} })
    .then((docs) => {
      res.status(200).send(docs);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  } else {
    res.status(400).send({
      error: 'Missing \'q\' param',
    });
  }
}