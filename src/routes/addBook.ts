import { Response, Request } from 'express';
import models from '../models/index';
import axios from 'axios';
import moment from 'moment';

const Book = models.Book;

export default (req: Request, res: Response) => {
  console.log(`Add Book: ${req.query.isbn}`);
  if (req.body.numberOfBooks && req.body.numberOfBooks >= 1) {
    axios.get(`http://openlibrary.org/isbn/${req.query.isbn}.json`)
    .then((apiRes) => {
      const openLibraryBook = apiRes.data;
      // openLibraryBook.authors.forEach((author: { key: string }) => {
      //  
      // });
      // axios.get(`https://openlibrary.org${author.key}.json`)
      const book = new Book({
        name: openLibraryBook.title,
        author: openLibraryBook.authors[0].key,
        publisher: openLibraryBook.publishers[0],
        publicationDate: moment(openLibraryBook.publish_date).unix(),
        coverUrl: `https://covers.openlibrary.org/b/id/${openLibraryBook.covers[0]}.jpg`,
        isbn: req.query.isbn,
        pages: openLibraryBook.number_of_pages,
        numberOfBooks: req.body.numberOfBooks,
        borrowUsernames: [],
      });
      // ajouter le nombre de livre par library dans la base
      book.save()
      .then((doc) => {
        res.status(200).send({
          status: 'Created',
          doc,
        });
      })
      .catch((err) => {
        res.status(500).send(err);
      })
    })
    .catch((err) => {
      res.status(500).send({
        error: 'Open Library Org is unavailable',
        err,
      });
    });
  } else {
    res.status(400).send({
      error: 'Missing \'numberOfBooks\' in post body.'
    });
  }
}
