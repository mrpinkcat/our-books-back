import { Response, Request } from 'express';

import model from './../models';
const Library = model.Library;

export default (req: Request, res: Response) => {
  console.log('/librarys');
  console.log(req.body);
  if (req.body.name && req.body.address && req.body.address.street && req.body.address.city && req.body.address.zipCode && typeof req.body.address.zipCode === 'number' && req.body.address.country) {
    const body: { name: string, address: { street: string, city: string, zipCode: number, country: string, state?: string } } = req.body;
    new Library({
      name: body.name,
      street: body.address.street,
      city: body.address.city,
      zipCode: body.address.zipCode,
      country: body.address.country,
      state: body.address.state ? body.address.state : undefined,
    }).save()
    .then((doc) => {
      res.status(200).send({
        status: 'Created',
        doc,
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
  } else {
    res.status(400).send({
      error: 'Body must contain name, address.street, address.city, address.zipCode (number), address.country. You can add address.state',
    });
  }
}