import models from './models/index';
import Promise from 'bluebird';

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
