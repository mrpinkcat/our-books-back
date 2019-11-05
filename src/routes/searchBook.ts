import { Response, Request } from 'express';
import models from '../models/index';

const Book = models.Book;

export default (req: Request, res: Response) => {
  if (req.query.q) {
    Book.find({ $text: { $search: req.query.q } })
    .then((docs) => {
      res.status(200).send(docs);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  } else if (req.query.isbn) {
    Book.find({ isbn: req.query.isbn })
    .then((docs) => {
      if (docs.length !== 0) {
        res.status(200).send(docs);
      } else {
        res.status(404).send({
          error: `No books for isbn ${req.query.isbn}`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  } else {
    Book.find().limit(200)
    .then((docs) => {
      res.status(200).send(docs);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  }
}