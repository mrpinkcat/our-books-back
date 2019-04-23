import models from './models/index';
import Promise from 'bluebird';
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
