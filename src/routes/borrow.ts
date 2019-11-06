import { Response, Request } from 'express';
import models from '../models/index';

const Book = models.Book;
const User = models.User;
const Library = models.Library;

export default (req: Request, res: Response) => {
  console.log('/borrow');
  if (req.body.id && req.body.libraryId && res.locals.username) {
    const id = req.body.id;
    const libraryId = req.body.libraryId;
    const username = res.locals.username;
    User.findOne({ username })
    .then((userDoc) => {
      if (userDoc) {
        Library.findOne({ _id: libraryId })
        .then((LibraryDoc) => {
          if (LibraryDoc) {
            // Check si l'utilisateur à pas déjà borrow ce livre
            Book.find({ borrowUsername: username })
            .then((checkBookDoc) => {
              console.log(checkBookDoc);
              // L'utilisateur n'a pas déjà emprunter de livre
              if (checkBookDoc.length === 0) {
                Book.findOne({ _id: id, borrowUsername: undefined })
                .then((bookDoc) => {
                  if (bookDoc) {
                    Book.findByIdAndUpdate(bookDoc.id, { borrowUsername: res.locals.username, libraryId: libraryId })
                    .then((update) => {
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
                      error: `Book '${id}' not found`,
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
                  error: `User ${username} allready borrow this book (${libraryId})`,
                });
              }
            })
          } else {
            res.status(400).send({
              error: `Library ${libraryId} not found`,
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
      error: 'Missing \'id\' for the book id, and \'libraryid\' params',
    });
  }
}
