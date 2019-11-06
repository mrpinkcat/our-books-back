import { Response, Request } from 'express';
import models from '../models/index';

const Book = models.Book;

export default (req: Request, res: Response) => {
  console.log('Get /books');
  if (req.query.q) {
    console.log(`    q=${req.query.q}`);
    Book.find({ $text: { $search: req.query.q } })
    .then((docs) => {
      res.status(200).send(docs);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  } else if (req.query.isbn) {
    console.log(`    isbn=${req.query.isbn}`);
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
    console.log(`    get all books`);
    Book.find().limit(200)
    .then((docs) => {
      res.status(200).send(docs);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  }
}