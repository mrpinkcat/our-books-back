import { Response, Request } from 'express';
import models from '../models/index';

const Book = models.Book;

export default (req: Request, res: Response) => {
  if (req.query.bookid, req.query.libraryid) {
    const bookid = req.query.bookid;
    const libraryid = req.query.libraryid;
    Book.update({_id: bookid}, {borrowUsername: res.locals.username, libraryId: libraryid})
    .then((res) => {
      res.status(200).send(res);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
    Book.findOne({_id: bookid})
    .then((doc) => {
      if (doc) {
        doc.toJSON().borrowUsername = undefined;
      }
    });
  } else {
    res.status(400).send({
      error: 'Missing \'bookid\' and \'libraryid\' params',
    });
  }
}
