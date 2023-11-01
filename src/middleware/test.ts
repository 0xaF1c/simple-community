import { RequestHandler } from "express-serve-static-core";

export const test: RequestHandler = (_req, _res, next) => {
  console.log('no thing, just test this middleware');
  
  next()
}