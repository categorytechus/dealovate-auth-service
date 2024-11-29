import { Request, Response, NextFunction } from 'express';
import { getDb } from '../_dbs/postgres/pgConnection';
import { User } from '../entities/user.entity';
import { AuthService } from '../services/auth.service';
import { LoginResponse } from '../dtoes/login.dto';
import { UserResponse } from '../dtoes/user.dto';
import { PasswordRestLinkResponse } from '../dtoes/passwordResetLink.dto';
import ErrorMessage from '../_configs/errors/customError.json';
import { EmailVerificationLinkResponse } from '../dtoes/emailVerificationLink.dto';
import { Encrypt } from '../helpers/encrypt';
const authService = new AuthService();
export class AuthController {
  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      let userName: string = req.body.userName;
      let password: string | undefined = req.body.password;

      let token: string | undefined = req.headers['authorization']
      ? req.headers['authorization'].split(' ')[1]  // Extract token from "Bearer <token>"
      : undefined;

      let userDetail: LoginResponse = await authService.checkUser(
        userName,
        password,
        token
      );
      res.locals.data = userDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      let user: any = req.body;
      user.authType = 'password';
      let createdUser: UserResponse = await authService.createUser(user);
      if (createdUser != undefined) {
        res.locals.data = { userId: createdUser.userId };
      }
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }


  async getValidateToken(req: Request, res: Response) {
    const header = req.headers.authorization;
    
    try {
      const response = await authService.checkValidToken(header);
      return res.status(200).json(response); 
    } catch (err) {
      if (err) {
        return res.status(err.statusCode).json({
          status: err.status,
          error: err.message,
        });
      } else {
        return res.status(500).json({
          status: 'error',
          error: 'Internal Server Error',
        });
      }
    }
  }


  async socialSignIn(req: Request, res: Response, next: NextFunction) {
    try {
      let userDetail: any = req.body;
      if (userDetail != undefined && userDetail.loginType == 'google') {
        let loginDetail: any = await authService.verifyGoogleUser(
          userDetail.token,
        );
        if (loginDetail != undefined) {
          loginDetail.emailId = loginDetail.email;
          loginDetail.authType = 'google';
          let fullName = loginDetail.name.split(' ');
          loginDetail.firstName = fullName[0];
          loginDetail.lastName = fullName[1];
          loginDetail.mobile = '';
          let loginResponse: LoginResponse =
            await authService.getUser(loginDetail);
          res.locals.data = loginResponse;
        } else {
          let err = new Error();
          err.name = 'FailedGoogleLogin';
          err.message = ErrorMessage.FailedGoogleLogin;
          res.locals.error = err;
        }
      } else if (
        userDetail != undefined &&
        userDetail.loginType == 'linkedin'
      ) {
        let code: string = userDetail.token.replace(/[\r\n]+/g, '').trim();
        let loginDetail: any = await authService.verifyLinkedInUser(code);
        if (loginDetail != undefined && loginDetail.code == undefined) {
          loginDetail.emailId = loginDetail.email;
          loginDetail.authType = 'linkedin';
          let fullName = loginDetail.name.split(' ');
          loginDetail.firstName = fullName[0];
          loginDetail.lastName = fullName[1];
          loginDetail.mobile = '';
          let loginResponse: LoginResponse =
            await authService.getUser(loginDetail);
          res.locals.data = loginResponse;
        } else {
          let err = new Error();
          err.name = 'FailedLinkedInLogin';
          err.message = ErrorMessage.FailedLinkedInLogin;
          res.locals.error = err;
        }
      }
    } catch (err: any) {
      res.locals.error = err;
    }
    next();
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      let tokenDetail: any = req.body;
      let loginDetail: LoginResponse = await authService.refreshToken(
        tokenDetail.refreshToken,
        tokenDetail.token,
      );
      res.locals.data = loginDetail;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async generatePasswordResetLink(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      let userName: string = req.body.userName;
      let passwordResetLink: PasswordRestLinkResponse =
        await authService.generatePasswordResetLink(userName);
      res.locals.data = passwordResetLink;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async testEncrypt(req: Request, res: Response, next: NextFunction) {
    try {
      let tokenDetail: any = req.body;
      let verificationDetail: string = Encrypt.encrypt(tokenDetail.text);
      if (verificationDetail != undefined) {
        res.locals.data = {
          text: tokenDetail.text,
          encrypted: verificationDetail,
        };
      }
      res.locals.error = {
        message: 'encrypt',
      };
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      let passwordDetail: any = req.body;
      let resetPassword: any = await authService.resetPassword(
        passwordDetail.userName,
        passwordDetail.password,
        passwordDetail.confirmPassword,
        passwordDetail.resetToken,
      );
      res.locals.data = resetPassword;
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }

  async testDecrypt(req: Request, res: Response, next: NextFunction) {
    try {
      let tokenDetail: any = req.body;
      let verificationDetail: string = Encrypt.decrypt(tokenDetail.id);
      if (verificationDetail != undefined) {
        res.locals.data = { decrypted: verificationDetail };
      }
      res.locals.error = {
        message: 'Unable to decrypt',
      };
    } catch (err) {
      res.locals.error = err;
    }
    next();
  }
}
