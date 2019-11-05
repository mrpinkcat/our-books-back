import { Response, Request } from 'express';

import { getBookInfo, addAuthorBook } from './../utils';

import models from '../models/index';
const Book = models.Book;

/**
 * Add books express request
 */
export default (req: Request, res: Response) => {
  console.log(`Add Book: ${req.params.isbn}`);
  // Si il y a les argument 'numberOfBooks' et 'librariesIds'
  if (req.body.numberOfBooks && req.body.librariesIds && req.body.category) {
    // Si la longueur de l'array 'librariesIds' est égale au nombre de livres
    if (req.body.librariesIds.length === req.body.numberOfBooks) {
      // Si 'numberOfBooks' est compris entre 1 et 100
      if (req.body.numberOfBooks >= 1 && req.body.numberOfBooks <= 100) {
        const body: { numberOfBooks: number, librariesIds: string[] } = req.body;

        console.log(`${req.body.numberOfBooks} books ISBN:${req.params.isbn} in ${req.body.librariesIds}`);
  
        let books: { name: string, author: string, publisher: string, publicationDate: Date, coverUrl: string, isbn: string, pages: number, description: string, borrowUsernames: undefined, libraryId: string}[] = [];

        let bookInfo: {name: string, author: string, publisher: string, publicationDate: Date, coverUrl: string, isbn: string, pages: number, description: string };

        getBookInfo(req.params.isbn)
        .then((book) => {
          bookInfo = {
            name: book.name,
            author: book.author,
            publisher: book.publisher,
            publicationDate: book.publicationDate,
            coverUrl: book.coverUrl,
            isbn: req.params.isbn,
            pages: book.pages,
            description: book.description,
          }

          body.librariesIds.forEach((libraryId, index) => {
            books.push({
              name: bookInfo.name,
              author: bookInfo.author,
              publisher: bookInfo.publisher,
              publicationDate: bookInfo.publicationDate,
              coverUrl: bookInfo.coverUrl,
              isbn: bookInfo.isbn,
              pages: bookInfo.pages,
              borrowUsernames: undefined,
              libraryId,
              description: bookInfo.description,
            });
            if (index + 1 === body.librariesIds.length) {
              // Insertion des livres dans la base
              Book.insertMany(books)
              .then((bookDocs) => {
                // Insertion de l'auteur
                addAuthorBook(book.author, req.params.isbn)
                .then((authorDoc) => {
                  // Réponse si tout ces bien passé
                  res.status(200).send({
                    status: 'Created',
                    bookDocs,
                  });
                })
              })
              .catch((err) => {
                res.status(500).send({
                  error: 'Fail to insert in database',
                  err,
                });
              });
            }
          });
        })
        .catch((err) => {
          if (err === 404) {
            res.status(404).send({
              error: 'Google Boooks retrun an error',
              err,
            });
          } else {
            res.status(500).send({
              error: 'Google Boooks retrun an error',
              err,
            });
          }
        });
      } else {
        res.status(400).send({
          error: '\'numberOfBooks\' must be between 1 and 100',
        });
      }
    } else {
      res.status(400).send({
        error: '\'librariesIds\' array length and \'numberOfBooks\' must be equal',
      });
    }
  } else {
    res.status(400).send({
      error: 'Body must contain \'librariesIds\', \'numberOfBooks\' and \‘category\'',
    });
  }
}
