import { Response, Request } from 'express';
import models from '../models/index';

const Book = models.Book;
const User = models.User;
const Library = models.Library;

export default (req: Request, res: Response) => {
  if (req.body.isbn && req.body.libraryid && req.body.username) {
    const isbn = req.body.isbn;
    const libraryid = req.body.libraryid;
    const username = req.body.username;
    User.findOne({ username })
    .then((userDoc) => {
      if (userDoc) {
        Library.findOne({ _id: libraryid })
        .then((LibraryDoc) => {
          if (LibraryDoc) {
            Book.findOne({ isbn, borrowUsername: undefined })
            .then((bookDoc) => {
              if (bookDoc) {
                console.log('bookDoc');
                console.log(bookDoc);
                Book.findByIdAndUpdate(bookDoc.id, { borrowUsername: res.locals.username, libraryId: libraryid })
                .then((update) => {
                  console.log('update');
                  console.log(update);
                  res.status(200).send({
                    status: 'Updated',
                    update,
                  });
                })
                .catch((err) => {
                  res.status(500).send({
                    err,
                  });
                });
              } else {
                res.status(400).send({
                  error: `Book with ISBN '${isbn}' not found`,
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
              error: `Library ${libraryid} not found`,
            });
          }
        })
        .catch((err) => {
          res.send(500).send({
            err,
          });
        });
      } else {
        res.status(400).send({
          error: `User ${username} not found`,
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
      error: 'Missing \'bookid\' and \'libraryid\' params',
    });
  }
}
