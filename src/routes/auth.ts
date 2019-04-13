import { Response, Request } from 'express';

export const auth = (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).json({token: 'Bonjour'}).send();
}