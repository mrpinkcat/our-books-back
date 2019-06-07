import { Response, Request } from 'express';
import models from '../models/index';

const Book = models.Book;

export default (req: Request, res: Response) => {
  console.log(req.params.isbn)
  if (req.params.isbn) {
    const isbn = req.params.isbn
    Book.find({ isbn })
    .then((docs) => {
      if (docs.length > 0) {
        Book.deleteMany({ isbn })
        .then((delRes) => {
          res.status(200).send({
            status: 'Deleted',
            delRes,
          });
        })
        .catch((err) => {
          res.status(500).send({
            err,
          });
        });
      } else {
        res.status(400).send({
          error: 'This book is not in any libraries',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        err,
      });
    });
  } else {
    res.status(400).send({
      error: 'Request must contain param :isbn',
    });
  }
}