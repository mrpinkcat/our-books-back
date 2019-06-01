import models from './models/index';
import Promise from 'bluebird';
import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import { Request, Response, NextFunction} from 'express';

const User = models.User;

/**
 * A function that check the admin rank of the token
 * @param token The token to check
 */
export const checkTokenAdmin = (token: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    User.findOne({token})
    .then((doc) => {
      if (doc) {
        let user = doc.toJSON()
        if (user.rank === 'admin') {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        reject(`No user found for this token (${token})`);
      }
    })
    .catch((err) => {
      reject('Mongo error');
    });
  });
}

/**
 * Middleware for checking the bearer token
 * @param req Express Request
 * @param res Express Response
 * @param next Express Next function
 */
export const needAdminRank = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization && req.headers.authorization.match(/^Bearer /g)) {
    const token = req.headers.authorization.slice(7, req.headers.authorization.length);
    checkTokenAdmin(token)
    .then((admin) => {
      if (admin) {
        next();
      } else {
        res.status(401).send({
          error: 'Your are not admin...'
        });
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  } else {
    res.sendStatus(401);
  }
}

/**
 * Middleware for checking the authentication
 * @param req Express Request
 * @param res Express Response
 * @param next Express Next function
 */
export const needAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization && req.headers.authorization.match(/^Bearer /g)) {
    const token = req.headers.authorization.slice(7, req.headers.authorization.length);
    User.findOne({token})
    .then((doc) => {
      if (doc) {
        res.locals.username = doc.toJSON().username;
        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  } else {
    res.sendStatus(401);
  }
}

/**
 * Get information about a book by isbn (google.com/books)
 * @param isbn Book ISBN
 */
export const getBookInfo = (isbn: string): Promise<{ name: string, authors: string[], publisher: string, publicationDate: Date, coverUrl: string, pages: number, description: string }> => {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
    .then((apiRes) => {
      if (apiRes.data.totalItems === 1) {
        const bookInfo: { 
          id: string,
          volumeInfo: {
            title: string,
            authors: string[],
            publishedDate: string,
            publisher: string,
            description: string,
            industryIdentifiers: {
              type: string,
              identifier: string,
            }[],
            pageCount: number,
            maturityRating: string,
            language: string,
            imageLinks: {
              smallThumbnail: string,
              thumbnail: string,
            },
          },
        } = apiRes.data.items[0];
        resolve({
          name: bookInfo.volumeInfo.title,
          authors: bookInfo.volumeInfo.authors,
          publisher: bookInfo.volumeInfo.publisher,
          publicationDate: new Date(bookInfo.volumeInfo.publishedDate),
          coverUrl: `https://books.google.com/books/content/images/frontcover/${bookInfo.id}?fife=h600`,
          pages: bookInfo.volumeInfo.pageCount,
          description: bookInfo.volumeInfo.description,
        });
      } else {
        reject({
          error: `Book with ISBN ${isbn} not found`,
        });
      }
    })
    .catch((err) => {
      // console.log('err.response');
      // console.log(err.response);
      // console.log('err');
      // console.log(err);
      if (err.response) {
        const errResponse: AxiosResponse = err.response;
        if (errResponse.status === 404) {
          reject(404)
        } else {
          reject(errResponse.statusText);
        }
        console.log(errResponse.status);
        console.log(errResponse.statusText);
        // console.log(errResponse.data);
      } else {
        reject('err');
      }
    });
  });
}
