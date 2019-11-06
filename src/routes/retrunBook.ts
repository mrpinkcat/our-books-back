import { Response, Request } from 'express';
import models from '../models/index';

const Book = models.Book;

export default (req: Request, res: Response) => {
  console.log(`Get /return`);
  console.log(`    borrowUsername: ${req.body.borrowUsername}`);
  if (req.body.borrowUsername) {
    Book.findOneAndUpdate({ borrowUsername: req.body.borrowUsername }, { borrowUsername: undefined })
    .then((doc) => {
      console.log(doc);
      if (doc) {
        res.status(200).send(doc);
      } else {
        res.status(404).send({
          error: 'No book borrowed by the user',
        });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  } else {
    res.status(400).send({
      error: 'Missing borrowUsername in body',
    });
  }
}