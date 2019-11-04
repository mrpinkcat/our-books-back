import { Response, Request } from 'express';

import model from './../models';
import Axios from 'axios';
import env from '../env';
const Library = model.Library;

export default (req: Request, res: Response) => {
  console.log('/librarys');
  console.log(req.body);
  if (req.body.name && req.body.address && req.body.address.street && req.body.address.city && req.body.address.zipCode && typeof req.body.address.zipCode === 'number' && req.body.address.country) {
    const body: { name: string, address: { street: string, city: string, zipCode: number, country: string, state?: string } } = req.body;

    // Récupération des coordonées de la bibliothèque
    Axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCA6cZhpWh63hzSQzWMpXn75f9KdM9EYKE`, {
      params: {
        address: `${body.address.street}, ${body.address.zipCode}, ${body.address.city}, ${body.address.country}`,
        key: env.geocode,
        region: 'fr',
      }
    })
    .then((gRes) => {
      console.log(`${body.address.street}, ${body.address.zipCode}, ${body.address.city}, ${body.address.country}`);
      const latitude = gRes.data.results[0].geometry.location.lat;
      const longitude = gRes.data.results[0].geometry.location.lng;

      new Library({
        name: body.name,
        street: body.address.street,
        city: body.address.city,
        zipCode: body.address.zipCode,
        country: body.address.country,
        state: body.address.state ? body.address.state : undefined,
        latitude,
        longitude,
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
    })
    .catch((gErr) => {
      res.status(500).send({
        error: 'Error Google GeoCode API',
      });
    })

  } else {
    res.status(400).send({
      error: 'Body must contain name, address.street, address.city, address.zipCode (number), address.country. You can add address.state',
    });
  }
}