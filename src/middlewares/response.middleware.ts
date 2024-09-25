import { Request, Response } from 'express';

export const CustomResponse = (req: Request, res: Response) => {
  try {
    if (res.locals?.error != undefined && res.locals.error.error != undefined) {
      if (res.locals.error.error.indexOf('Conflict') != -1) {
        let error: any = res.locals.error;
        error.statusCode = 409;
        res.locals = undefined;
        res.status(error.statusCode).json(error);
      } else if (res.locals.error.error.indexOf('Token') != -1) {
        let error: any = res.locals.error;
        error.statusCode = 401;
        res.locals = undefined;
        res.status(error.statusCode).json(error);
      } else if (res.locals.error.error.indexOf('FailedGoogleLogin') != -1) {
        let error: any = res.locals.error;
        error.statusCode = 403;
        res.locals = undefined;
        res.status(error.statusCode).json(error);
      } else if (res.locals.error.error.indexOf('FailedLinkedInLogin') != -1) {
        let error: any = res.locals.error;
        error.statusCode = 403;
        res.locals = undefined;
        res.status(error.statusCode).json(error);
      } else {
        let error: any = res.locals.error;
        error.statusCode =
          res.locals.error.statusCode != undefined
            ? res.locals.error.statusCode
            : 500;
        res.locals = undefined;
        res.status(error.statusCode).json(error);
      }
    } else {
      let data: any = res.locals.data;
      res.locals = undefined;
      return res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
