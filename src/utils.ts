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
 * Get information about a book by isbn (openlibrary.org)
 * @param isbn Book ISBN
 */
export const getBookInfo = (isbn: string): Promise<{ name: string, author: string, publisher: string, publicationDate: number, coverUrl: string, pages: number }> => {
  return new Promise((resolve, reject) => {
    axios.get(`http://openlibrary.org/isbn/${isbn}.json`)
    .then((apiRes) => {
      let publicationDate;
      if (apiRes.data.publish_date.length === 4) {
        publicationDate = (apiRes.data.publish_date - 1970)*31536000;
      } else {
        publicationDate = moment(apiRes.data.publish_date).unix();
      }
      resolve({
        name: apiRes.data.title,
        author: apiRes.data.authors[0].key,
        publisher: apiRes.data.publishers[0],
        publicationDate: publicationDate,
        coverUrl: `https://covers.openlibrary.org/b/id/${apiRes.data.covers[0]}.jpg`,
        pages: apiRes.data.number_of_pages,
      })
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
