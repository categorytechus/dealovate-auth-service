import { NextFunction, Request, Response } from 'express';
import { JWT } from '../helpers/jwt';
import * as dotenv from 'dotenv';
import { LoggedInUser } from '../dtoes/loggedInUser.dto';
import ErrorMessage from '../_configs/errors/customError.json';
import { CustomError } from '../helpers/customError';
dotenv.config();
const jwt = new JWT();

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let header = req.headers.authorization;
    let aud = req.headers.origin;
    if (!header) {
      return res.status(401).json({ status: 'fail', error: 'Unauthorized' });
    }
    if (!aud) {
      // comment this block to secure for specific domain
      aud = 'http://127.98.102.451:8701';
    }
    if (!aud) {
      let er = new CustomError(
        421,
        'fail',
        'MisdirectedRequest',
        'No enough privileges to access endpoint',
      );
      return res.status(er.statusCode).json(er);
    }

    const token = header.split(' ')[1];
    if (!token) {
      let er = new CustomError(
        401,
        'fail',
        'NoAccessToken',
        ErrorMessage.NoAccessToken,
      );
      return res.status(er.statusCode).json(er);
    }
    const decoded = await jwt.validateToken(token, aud);
    if (!decoded) {
      let er = new CustomError(
        401,
        'fail',
        'InvalidToken',
        ErrorMessage.InvalidToken,
      );
      return res.status(er.statusCode).json(er);
    }
    let currentUser: LoggedInUser = new LoggedInUser();
    currentUser.userId = decoded.userId;
    currentUser.companyId = decoded.companyId;
    currentUser.firstName = decoded.firstName;
    currentUser.lastName = decoded.lastName;
    currentUser.fullName = decoded.fullName;
    currentUser.mobile = decoded.mobile;
    currentUser.emailId = decoded.emailId;
    req['currentUser'] = currentUser;
    next();
  } catch (err: any) {
    if (err.name == 'TokenExpiredError') {
      let er = new CustomError(
        401,
        'fail',
        'TokenExpiredError',
        ErrorMessage.TokenExpiredError,
      );
      return res.status(er.statusCode).json(er);
    } else {
      let er = new CustomError(
        401,
        'fail',
        'InvalidToken',
        ErrorMessage.InvalidToken,
      );
      return res.status(401).json(er);
    }
  }
};
