import { sign, SignOptions, verify, VerifyOptions, decode } from 'jsonwebtoken';
//import config from './../_configs/default';
import fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import moment from 'moment';
import dotenv from 'dotenv';
dotenv.config();
const {  } = process.env;
//import User from '../_models/user';

const { dirPath, allowedOrigins, aud, iss, sub,tokenExpireTime } = process.env;

export class JWT {
  generateToken(userDetail: any, userClaims: any) {
    // information to be encoded in the JWT
    let payload = {
      userId: userDetail.userId,
      userName: userDetail.userName,
      firstName: userDetail.firstName,
      lastName: userDetail.lastName,
      fullName: `${userDetail.firstName} ${userDetail.lastName}`,
      tenantId: userDetail.tenantId,
      mobile: userDetail.mobile,
      emailId: userDetail.emailId,
      userClaims: userClaims,
    };
    let privateKey: Buffer = fs.readFileSync(
      path.join(dirPath + 'private.key'),
    );

    let audience: string[] = aud.split(',');
    let signInOptions: SignOptions = {
      issuer: iss,
      subject: sub,
      audience: audience,
      algorithm: 'RS256',
      expiresIn: `${tokenExpireTime}m`,
      jwtid: `${userDetail.userId}`,
      keyid: '7345274',
    };

    // generate JWT
    return sign(payload, privateKey, signInOptions);
  }

  generateRefreshToken(userId: string) {
    let timestamp = moment().clone().format('DDMMMYYYYHHmmssSSSZ');
    let refreshTokenString = `${userId}${timestamp}`;
    return bcrypt.hashSync(refreshTokenString, 12);
  }

  validateToken(token: string, aud: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let publicKey: Buffer = fs.readFileSync(
        path.join(dirPath + 'public.key'),
      );

      let verifyOptions: VerifyOptions = {
        algorithms: ['RS256'],
        audience: aud,
        issuer: iss,
        ignoreExpiration: false,
      };

      verify(token, publicKey, verifyOptions, (error: any, decoded: any) => {
        if (error) return reject(error);
        if (decoded.jti != decoded.userId) {
          let error: any = new Error('Token tampered');
          error.name = 'TokenTamperedError';
          return reject(error);
        }
        resolve(decoded);
      });
    });
  }

  getClaimFromToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let publicKey: Buffer = fs.readFileSync(
        path.join(dirPath + 'public.key'),
      );
      let decoded: any = decode(token, { complete: true });
      if (!decoded) {
        resolve('Unauthorized');
      } else {
        resolve(decoded);
      }
    });
  }
}
