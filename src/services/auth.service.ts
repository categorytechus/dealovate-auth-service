import axios from 'axios';
import { getDb } from '../_dbs/postgres/pgConnection';
import { User } from '../entities/user.entity';
import { Encrypt } from '../helpers/encrypt';
import { plainToClass } from 'class-transformer';
import { UserResponse } from '../dtoes/user.dto';
import { LoginResponse } from '../dtoes/login.dto';
import { JWT } from '../helpers/jwt';
import { UserRole } from '../entities/userRole.entity';
import { UserLogin } from '../entities/userLogin.entity';
import dotenv from 'dotenv';
import ErrorMessage from '../_configs/errors/customError.json';
import { CustomError } from '../helpers/customError';
import { EmailVerificationLinkResponse } from '../dtoes/emailVerificationLink.dto';
import { TenantUser } from '../entities/tenantUser.entity';
import { Tenant } from '../entities/tenant.entity';
import { UserOtpLinkVerification } from '../entities/userOtpLinkVerification.entity';
import appConfig from '../_configs/app/appConfig.json';
import moment from 'moment';
import { EmailNotification } from '../entities/emailNotification.entity';
import { Role } from '../entities/role.entity';
import { PasswordRestLinkResponse } from '../dtoes/passwordResetLink.dto';
import { PasswordReset } from '../entities/passwordReset.entity';
const qs = require('qs');
dotenv.config();

const { refreshTokenExpireTime, resetTokenExpireTime, defaultPassword, client_id, client_secret } =
  process.env;
const jwt = new JWT();
export class AuthService {
  // async checkUser(userName: string, password: string): Promise<LoginResponse> {
  //   let db = await getDb();
  //   try {
  //     let userLoginRepo = await db.getRepository(UserLogin);
  //     let userLogin: UserLogin = await db.manager.findOne(UserLogin, {
  //       where: {
  //         userName: userName != undefined ? userName : '',
  //         isActive: 1,
  //       },
  //     });
  //     if (userLogin == undefined) {
  //       let err = new CustomError(
  //         401,
  //         'fail',
  //         'UserNotFound',
  //         ErrorMessage.UserNotFound,
  //       );
  //       throw err;
  //     }
  //     if (!Encrypt.comparePassword(userLogin.hashPassword, password)) {
  //       userLogin.wrongCredentialCounter = userLogin.wrongCredentialCounter + 1;
  //       if (userLogin.wrongCredentialCounter >= appConfig.maxWrongPasswordTry) {
  //         userLogin.isBlocked = 1;
  //       }
  //       let updatedUserLogin = await userLoginRepo.save(userLogin);
  //       let err = new CustomError(
  //         401,
  //         'fail',
  //         'IncorrectPassword',
  //         `${ErrorMessage.IncorrectPassword}, ${appConfig.maxWrongPasswordTry - userLogin.wrongCredentialCounter} attempt is remaining`,
  //       );
  //       throw err;
  //     }
  //     let loginDetail: LoginResponse = await this.getLoginDetail(
  //       userLogin.userId,
  //     );
  //     return loginDetail;
  //   } catch (error: any) {
  //     console.log(error)
  //       let err = new CustomError(
  //         401,
  //         'fail',
  //         'RecordNotFound',
  //         ErrorMessage.RecordNotFound,
  //       );
  //     throw err;
  //   }
  // }

  async checkUser(userName: string, password: string | undefined, token: string | undefined): Promise<LoginResponse> {
    let db = await getDb();
    try {
      let userLoginRepo = await db.getRepository(UserLogin);

      if (token) {
        // Step 1: Validate token and extract userId from token
        const aud = 'http://127.98.102.451:8701'; // Secure for specific domain
        let decodedToken = await jwt.validateToken(token, aud); // assuming you have a verifyToken method
        if (!decodedToken) {
          let err = new CustomError(
            403,
            'fail',
            'InvalidToken',
            'The provided token is invalid or expired.'
          );
          throw err;
        }

        let userId = decodedToken.userId; // Extract userId from the decoded token

        // Step 2: Fetch userLogin by userName (no need for password check if token is present)
        let userLogin: UserLogin = await db.manager.findOne(UserLogin, {
          where: {
            userName: userName,
            isActive: 1,
          },
        });

        if (!userLogin) {
          let err = new CustomError(
            401,
            'fail',
            'UserNotFound',
            'User not found'
          );
          throw err;
        }

        // Check if the userName matches the userId from the token
        if (userLogin.userId !== userId) {
          let err = new CustomError(
            403,
            'fail',
            'Unauthorized',
            'The user does not have access to this tenant'
          );
          throw err;
        }

        let loginDetail: LoginResponse = await this.getLoginDetail(userLogin.userId);
        return loginDetail;

      } else {

        if (!password) {
          let err = new CustomError(
            401,
            'fail',
            'PasswordRequired',
            'Password is required for login'
          );
          throw err;
        }
        // Step 3: If no token is provided, follow the original flow (password check)
        let userLogin: UserLogin = await db.manager.findOne(UserLogin, {
          where: {
            userName: userName != undefined ? userName : '',
            isActive: 1,
          },
        });

        if (!userLogin) {
          let err = new CustomError(
            401,
            'fail',
            'UserNotFound',
            'User not found'
          );
          throw err;
        }

        if (!Encrypt.comparePassword(userLogin.hashPassword, password)) {
          userLogin.wrongCredentialCounter = userLogin.wrongCredentialCounter + 1;
          if (userLogin.wrongCredentialCounter >= appConfig.maxWrongPasswordTry) {
            userLogin.isBlocked = 1;
          }
          let updatedUserLogin = await userLoginRepo.save(userLogin);
          let err = new CustomError(
            401,
            'fail',
            'IncorrectPassword',
            `${ErrorMessage.IncorrectPassword}, ${appConfig.maxWrongPasswordTry - userLogin.wrongCredentialCounter} attempts remaining`
          );
          throw err;
        }

        let loginDetail: LoginResponse = await this.getLoginDetail(userLogin.userId);
        return loginDetail;
      }
    } catch (error: any) {
      console.log(error);
      // let err = new CustomError(
      //   401,
      //   'fail',
      //   'RecordNotFound',
      //   ErrorMessage.RecordNotFound,
      // );
      throw error;
    }
  }
  async createUser(user: any): Promise<UserResponse> {
    try {
      if (user.role !== 'tenant_admin' && !user.password) {
        let err =new CustomError(
          400, 
          'fail', 
          'PasswordRequired', 
          ErrorMessage.PasswordRequired
        );
        throw err
      }
      let db = await getDb();
      let userLoginRepo = await db.getRepository(UserLogin);
      let userRepo = await db.getRepository(User);
      let roleRepo = await db.getRepository(Role);
      let userRolesRepo = await db.getRepository(UserRole);
      let tenantUsersRepo = await db.getRepository(TenantUser);
      let userLogin: UserLogin = await userLoginRepo.findOne({
        where: { userName: user.emailId != undefined ? user.emailId : '' },
      });
      if (userLogin != undefined) {
        let err = new CustomError(
          401,
          'fail',
          'UserNameConflict',
          ErrorMessage.UserNameConflict,
        );
        throw err;
      }

      // //--------------------------------------- currently commented just because google and linkedin does'nt
      // //provide mobile and that case blank mobile will create duplicate issue
      // let userMobile: User = await userRepo.findOne({
      //   where: { mobile: user.mobile != undefined ? user.mobile : '' },
      // });
      // if (userMobile != undefined) {
      //   let err = new Error();
      //   err.name = 'MobileConflict';
      //   err.message = ErrorMessages.MobileConflict;
      //   throw err;
      // }

      let userEmail: User = await userRepo.findOne({
        where: { emailId: user.emailId != undefined ? user.emailId : '' },
      });
      if (userEmail != undefined) {
        let err = new CustomError(
          409,
          'fail',
          'EmailIdConflict',
          ErrorMessage.EmailIdConflict,
        );
        throw err;
      }
      let newUser: User = new User();
      newUser.firstName = user.firstName;
      newUser.lastName = user.lastName;
      newUser.emailId = user.emailId;
      newUser.mobile = user.mobile;
      newUser.isMobileVerfied = 0;
      newUser.isEmailVerified = 0;
      // newUser.alternateMobile = '';
      // newUser.gender = '';
      // newUser.nationality = '';
      // newUser.language = '';
      // newUser.currency = '';
      // newUser.timezone = 1;
      // newUser.dob = null;
      // newUser.profilePicture = null;
      // newUser.otherInfo = '{}';
      // newUser.isActive = 1;
      newUser.createdAt = new Date();
      newUser.createdBy = 'system';
      newUser.updatedBy = 'system';
      newUser.updatedAt = new Date();
      let addedUser = await userRepo.save(newUser);
      if (addedUser == undefined) {
        let err = new CustomError(
          409,
          'fail',
          'UserCreateError',
          ErrorMessage.UserCreateError,
        );
        throw err;
      }
      let newUserLogin: UserLogin = new UserLogin();
      newUserLogin.userId = addedUser.userId;
      newUserLogin.userName = user.emailId;
      newUserLogin.hashPassword = user.password ? Encrypt.encryptPass(user.password) : null;
      newUserLogin.authType = user.authType;
      newUserLogin.lastLoginAt = null;
      newUserLogin.userClaim = { test: 'test' };
      newUserLogin.isBlocked = 0;
      newUserLogin.isActive = 1;
      newUserLogin.createdBy = addedUser.userId;
      newUserLogin.createdAt = new Date();
      newUserLogin.updatedBy = addedUser.userId;
      newUserLogin.updatedAt = new Date();
      let addedUserLogin = await userLoginRepo.save(newUserLogin);
      if (addedUserLogin == undefined) {
        await userRepo.remove(addedUser);
        let err = new CustomError(
          409,
          'fail',
          'UserRemoveError',
          ErrorMessage.UserRemoveError,
        );
        throw err;
      }

      //////////////////////////////////////////////////////////////////////////////////////////////////

      let role: Role = await roleRepo.findOne({
        where: { roleName: user.role }, // Assuming role is coming as string
      });
      if (!role) {
        let err = new CustomError(
          404,
          'fail',
          'RoleNotFound',
          `Role '${user.role}' not found.`,
        );
        throw err;
      }

      // Create entry in user_roles table
      let newUserRole: UserRole = new UserRole();
      newUserRole.userId = addedUser.userId;
      newUserRole.roleId = role.roleId;
      newUserRole.tenantId = user.tenantId;
      newUserRole.isActive = 1;
      newUserRole.createdBy = addedUser.userId;
      newUserRole.createdAt = new Date();
      newUserRole.updatedBy = addedUser.userId;
      newUserRole.updatedAt = new Date();

      let addedUserRole = await userRolesRepo.save(newUserRole);
      if (!addedUserRole) {
        await userLoginRepo.remove(addedUserLogin); // Clean up if the role insertion fails
        await userRepo.remove(addedUser); // Clean up if the role insertion fails
        let err = new CustomError(
          409,
          'fail',
          'UserRoleCreateError',
          'Error creating user role association.',
        );
        throw err;
      }

      if (user.tenantId) {
        let newTenantUser = new TenantUser();
        newTenantUser.tenantId = user.tenantId; // tenant_id from frontend
        newTenantUser.userId = addedUser.userId; // user_id from the newly created user
        newTenantUser.isActive = 1;
        newTenantUser.createdBy = addedUser.userId; // Created by (could be system user or admin)
        newTenantUser.createdAt = new Date();
        newTenantUser.updatedBy = addedUser.userId; // Updated by
        newTenantUser.updatedAt = new Date();

        let addedTenantUser = await tenantUsersRepo.save(newTenantUser);
        if (!addedTenantUser) {
          await userRolesRepo.remove(addedUserRole); // Clean up if the tenant user insertion fails
          await userLoginRepo.remove(addedUserLogin); // Clean up if the tenant user insertion fails
          await userRepo.remove(addedUser); // Clean up if the tenant user insertion fails
          let err = new CustomError(
            409,
            'fail',
            'TenantUserCreateError',
            'Error creating tenant user association.',
          );
          throw err;
        }
      }


      //////////////////////////////////////////////////////////////////////////////////////////////////
      // let emailVerificationLink: EmailVerificationLinkResponse =
      //   await this.generateEmailVerificationLink(addedUser.userId);
      let userRes: UserResponse = new UserResponse();
      userRes.userId = addedUser.userId;
      userRes.firstName = addedUser.firstName;
      userRes.lastName = addedUser.lastName;
      userRes.fullName = `${addedUser.firstName} ${addedUser.lastName}`;
      userRes.roles = '';
      userRes.emailId = addedUser.emailId;
      userRes.mobile = addedUser.mobile;
      return userRes;
    } catch (error: any) {
      console.log(error)
      throw error;
    }
  }

  async checkValidToken(header: string | undefined) {
    if (!header) {
      throw new CustomError(
        401,
        'fail',
        'NoAccessToken',
        ErrorMessage.NoAccessToken,
      );
    }

    const token = header.split(' ')[1];
    const aud = 'http://127.98.102.451:8701'; // Secure for specific domain

    try {
      const decoded = await jwt.validateToken(token, aud);
      if (!decoded) {
        throw new CustomError(
          401,
          'fail',
          'InvalidToken',
          ErrorMessage.InvalidToken,
        );
      }

      // Return the decoded user information
      return decoded;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new CustomError(
          401,
          'fail',
          'TokenExpiredError',
          ErrorMessage.TokenExpiredError,
        );
      } else {
        throw new CustomError(
          401,
          'fail',
          'InvalidToken',
          ErrorMessage.InvalidToken,
        );
      }
    }
  }

  async generatePasswordResetLink(
    userName: string,
    appUrl: string,
    tenantId?: string
  ): Promise<PasswordRestLinkResponse> {
    try {
      let db = await getDb();
      let userLoginRepo = await db.getRepository(UserLogin);
      let userLogin: UserLogin = await userLoginRepo.findOne({
        where: { userName: userName != undefined ? userName : '', isActive: 1 },
      });
      if (userLogin == undefined) {
        let err = new CustomError(
          401,
          'fail',
          'UserNotFound',
          ErrorMessage.UserNotFound,
        );
        throw err;
      }

      let userRepo = await db.getRepository(User);
      let user: User = await userRepo.findOne({
        where: { userId: userLogin.userId }, // You can also use userName if needed
      });

      if (!user) {
        let err = new CustomError(
          401,
          'fail',
          'UserNotFound',
          ErrorMessage.UserNotFound
        );
        throw err;
      }
      const firstName = user.firstName;

      let resetPasswordRepo = db.getRepository(PasswordReset);
      let passwordReset: PasswordReset = await resetPasswordRepo.findOne({
        where: {
          userId: userLogin.userId != undefined ? userLogin.userId : '',
          isActive: 1,
        },
      });
      let currentDate = new Date();
      if (passwordReset == undefined) {
        passwordReset = new PasswordReset();
        passwordReset.userId = userLogin.userId;
        passwordReset.resetToken = Encrypt.generateEncryptedToken(
          userLogin.userId,
        );
        passwordReset.createdAt = currentDate;
        passwordReset.expireAt = new Date(
          currentDate.getTime() +
          parseInt(resetTokenExpireTime) * 60 * 60 * 1000,
        );
        passwordReset.isUsed = 0;
        passwordReset.isActive = 1;
        passwordReset.createdBy = userLogin.userId;
        passwordReset.updatedBy = userLogin.userId;
        passwordReset.updatedAt = currentDate;
      } else {
        passwordReset.resetToken = Encrypt.generateEncryptedToken(
          userLogin.userId,
        );
        passwordReset.createdAt = currentDate;
        passwordReset.expireAt = new Date(
          currentDate.getTime() +
          parseInt(resetTokenExpireTime) * 60 * 60 * 1000,
        );
        passwordReset.isUsed = 0;
        passwordReset.isActive = 1;
        passwordReset.updatedAt = currentDate;
        passwordReset.updatedBy = userLogin.userId;
      }
      let addedResetPasswordLink: PasswordReset =
        await resetPasswordRepo.save(passwordReset);
      if (addedResetPasswordLink == undefined) {
        let err = new CustomError(
          500,
          'fail',
          'PasswordResetLinkError',
          ErrorMessage.PasswordResetLinkError,
        );
        throw err;
      }
      let passwordResetLink: PasswordRestLinkResponse =
        new PasswordRestLinkResponse();
      const resetLink = `${appUrl}/resetpassword?userName=${userName}&token=${addedResetPasswordLink.resetToken}`;
      passwordResetLink.passwordResetLink = resetLink
      // await this.sendPasswordResetEmail(tenantId, userLogin.userId, userName, resetLink, firstName);
      return passwordResetLink;
    } catch (error: any) {
      console.log(error)
      throw error;
    }
  }

  async resetPassword(
    userName: string,
    password: string,
    confirmPassword: string,
    resetToken: string,
  ): Promise<any> {
    try {
      if (password != confirmPassword) {
        let err = new CustomError(
          401,
          'fail',
          'PasswordMismatch',
          ErrorMessage.PasswordMismatch,
        );
        throw err;
      }
      let db = await getDb();
      let passwordResetRepo = await db.getRepository(PasswordReset);
      let resetPasswordUser: PasswordReset = await passwordResetRepo.findOne({
        where: { resetToken: resetToken },
      });
      if (resetPasswordUser == undefined) {
        let err = new CustomError(
          401,
          'fail',
          'InvalidToken',
          ErrorMessage.InvalidToken,
        );
        throw err;
      } else {
        if (new Date(resetPasswordUser.expireAt) <= new Date()) {
          let err = new CustomError(
            401,
            'fail',
            'TokenExpired',
            ErrorMessage.TokenExpired,
          );
          throw err;
        }
        if (resetPasswordUser.isUsed == 1) {
          let err = new CustomError(
            401,
            'fail',
            'UsedToken',
            ErrorMessage.UsedToken,
          );
          throw err;
        }
      }
      let userLoginRepo = await db.getRepository(UserLogin);
      let userLogin: UserLogin = await userLoginRepo.findOne({
        where: { userName: userName, isActive: 1 },
      });
      if (userLogin == undefined) {
        let err = new CustomError(
          401,
          'fail',
          'UserNotFound',
          ErrorMessage.UserNotFound,
        );
        throw err;
      }
      userLogin.hashPassword = Encrypt.encryptPass(password);
      userLogin.updatedAt = new Date();
      userLogin.updatedBy = userLogin.userId;
      let updatedUserLogin: UserLogin = await userLoginRepo.save(userLogin);
      if (updatedUserLogin == undefined) {
        let err = new Error();
        err.name = 'dberror';
        err.message = 'Unable to reset password';
        throw err;
      }
      resetPasswordUser.isUsed = 1;
      let updatedResetPasswordUser: PasswordReset =
        await passwordResetRepo.save(resetPasswordUser);
      return { message: 'Password reset successfully' };
    } catch (error: any) {
      throw error;
    }
  }

  async changePassword(
    oldPassword: string,
    password: string,
    confirmPassword: string,
    user_id: string,
  ): Promise<any> {
    let db = await getDb();
    try {
      let userLoginRepo = await db.getRepository(UserLogin);
      let userLogin: UserLogin = await userLoginRepo.findOne({
        where: {
          userId: user_id != undefined ? user_id : '',
          isActive: 1,
        },
      });

      if (!userLogin) {
        let err = new CustomError(
          401,
          'fail',
          'UserNotFound',
          'User not found'
        );
        throw err;
      }

      if (!Encrypt.comparePassword(userLogin.hashPassword, oldPassword)) {
        let err = new CustomError(
          401,
          'fail',
          'IncorrectPassword',
          `${ErrorMessage.IncorrectPassword}`
        );
        throw err;
      }
      if (password != confirmPassword) {
        let err = new CustomError(
          401,
          'fail',
          'PasswordMismatch',
          ErrorMessage.PasswordMismatch,
        );
        throw err;
      }

      userLogin.hashPassword = Encrypt.encryptPass(password);
      userLogin.updatedAt = new Date();
      userLogin.updatedBy = user_id;
      let updatedUserLogin: UserLogin = await userLoginRepo.save(userLogin);
      if (updatedUserLogin == undefined) {
        let err = new Error();
        err.name = 'dberror';
        err.message = 'Unable to reset password';
        throw err;
      }

      return { message: 'Password changed successfully' };
    } catch (error: any) {
      throw error;
    }
  }

  async generateEmailVerificationLink(
    userId: string,
  ): Promise<EmailVerificationLinkResponse> {
    try {
      let db = await getDb();
      let userOtpLinkVerification: UserOtpLinkVerification =
        new UserOtpLinkVerification();
      let userLoginRepo = await db.getRepository(UserLogin);
      let userLogin: UserLogin = await userLoginRepo.findOne({
        where: { userId: userId != undefined ? userId : '', isActive: 1 },
      });
      userOtpLinkVerification.userId = userLogin.userId;
      userOtpLinkVerification.verificationType = 'email';
      userOtpLinkVerification.expiredAt = new Date(
        moment()
          .add(appConfig.emailLinkExpiryTime, 'hours')
          .format('MM-DD-YYYY HH:mm:ss'),
      );
      userOtpLinkVerification.isConsumed = 0;
      userOtpLinkVerification.isActive = 1;
      userOtpLinkVerification.verificationCode = Encrypt.generateEncryptedToken(
        userOtpLinkVerification.userId,
      );
      userOtpLinkVerification.createdAt = new Date();
      userOtpLinkVerification.createdBy = userId;
      userOtpLinkVerification.updatedAt = new Date();
      userOtpLinkVerification.updatedBy = userId;

      let userOtpLinkVerificationRepo = await db.getRepository(
        UserOtpLinkVerification,
      );
      let usersOtpLinks: UserOtpLinkVerification[] =
        await userOtpLinkVerificationRepo.find({
          where: { userId: userId, verificationType: 'email', isActive: 1 },
        });
      if (usersOtpLinks != undefined && usersOtpLinks.length > 0) {
        for (let userslink of usersOtpLinks) {
          userslink.isActive = 0;
          userslink.updatedAt = new Date();
          userslink.updatedBy = userId;
        }
        let updatedUsersLinks: UserOtpLinkVerification[] =
          await userOtpLinkVerificationRepo.save(usersOtpLinks);
        if (updatedUsersLinks) {
          let emailNotifRepo = await db.getRepository(EmailNotification);
          let emailNotifs: EmailNotification[] = [];
          //-------------------------------------inactivating email_notification related to particular user_otp_link_verification
          for (let userslink of updatedUsersLinks) {
            let emailNotif: EmailNotification = await emailNotifRepo.findOne({
              where: { referenceId: userslink.id },
            });
            emailNotif.isActive = 0;
            emailNotif.updatedAt = new Date();
            emailNotif.updatedBy = userId;
            emailNotifs.push(emailNotif);
          }
          await emailNotifRepo.save(emailNotifs);
        }
      }
      let addedUsersLink: UserOtpLinkVerification =
        await userOtpLinkVerificationRepo.save(userOtpLinkVerification);
      let isTenantUser: TenantUser = await db.manager.findOne(TenantUser, {
        where: { userId: userId, isActive: 1 },
      });
      let baseUrl: string = '';
      if (isTenantUser != undefined) {
        baseUrl = (
          await db.manager.findOne(Tenant, {
            where: { tenantId: isTenantUser.tenantId, isDeleted: 1 },
          })
        ).appUrl;
      } else {
        baseUrl = appConfig.baseUrl;
      }
      let encryptedUserId: string = Encrypt.encrypt(userLogin.userId);
      let verificationLink: string = `<a href="${appConfig.baseUrl}/verifyemail?id=${encryptedUserId}&code=${addedUsersLink.verificationCode}" target="_blank">Verify Link</a>`;

      let emailNotification: EmailNotification = new EmailNotification();
      emailNotification.templateId = '43cdb5c5-bb70-4784-9050-8e90d67c161d';
      emailNotification.referenceId = addedUsersLink.id;
      emailNotification.emailFrom = 'system_email';
      emailNotification.emailTo = userLogin.userName;
      emailNotification.subject = 'Email Verification';
      emailNotification.emailBody = verificationLink;
      emailNotification.emailStatus = 'pending';
      emailNotification.scheduleDate = new Date();
      emailNotification.isActive = 1;
      emailNotification.createdAt = new Date();
      emailNotification.createdBy = 'system';
      emailNotification.updatedAt = new Date();
      emailNotification.updatedBy = 'system';
      let emailNotifyRepo = await db.getRepository(EmailNotification);
      let addedEmailNotification =
        await emailNotifyRepo.save(emailNotification);
      if (addedEmailNotification == undefined) {
        let err = new CustomError(
          500,
          'fail',
          'CreateEmailNotifiationError',
          ErrorMessage.CreateEmailNotifiationError,
        );
        throw err;
      }
      let emailVerificationLink: EmailVerificationLinkResponse =
        new EmailVerificationLinkResponse();
      emailVerificationLink.emailVerificationLink = verificationLink;
      return emailVerificationLink;
    } catch (error: any) {
      throw error;
    }
  }

  async reGenerateEmailVerificationLink(
    id: string,
  ): Promise<EmailVerificationLinkResponse> {
    try {
      if (id != undefined) {
        let db = await getDb();
        // let userId: string = (
        //   await db.manager.findOne(UserLogin, { where: { userId: id } })
        // ).userId;
        let userId: string = Encrypt.decrypt(id); // uncomment this for decrypt the text
        if (!userId) {
          let err = new CustomError(
            401,
            'fail',
            'UserNotFound',
            ErrorMessage.UserNotFound,
          );
          throw err;
        }
        let userLogin: UserLogin = await db.manager.findOne(UserLogin, {
          where: {
            userId: userId != undefined ? userId : '',
          },
        });
        if (userLogin == undefined) {
          let err = new CustomError(
            401,
            'fail',
            'UserNotFound',
            ErrorMessage.UserNotFound,
          );
          throw err;
        }
        let emailVerificationLink: EmailVerificationLinkResponse =
          new EmailVerificationLinkResponse();
        emailVerificationLink =
          await this.generateEmailVerificationLink(userId);
        return emailVerificationLink;
      }
    } catch (error: any) {
      throw error;
      // let err = new CustomError(
      //   500,
      //   'fail',
      //   'CreateEmailNotifiationError',
      //   ErrorMessage.CreateEmailNotifiationError,
      // );
      // throw err;
    }
  }

  async verifyGoogleUser(token: string) {
    return new Promise((resolve, reject) => {
      try {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'https://www.googleapis.com/oauth2/v3/userinfo',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        axios
          .request(config)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            resolve(error);
          });
      } catch (error: any) {
        resolve(error);
      }
    });
  }
  async verifyLinkedInUser(token: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const params = {
          grant_type: 'authorization_code',
          code: token,
          redirect_uri: 'http://13.233.87.102:9800/',
          client_id: client_id,
          client_secret: client_secret,
        };
        const data = await axios.post(
          'https://www.linkedin.com/oauth/v2/accessToken',
          qs.stringify(params),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        );

        const { access_token } = data.data;
        const accessToken = access_token.replace(/[\r\n]+/g, '').trim();

        const userDetail = await axios.get(
          'https://api.linkedin.com/v2/userinfo',
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              'X-Restli-Protocol-Version': '2.0.0',
            },
          },
        );
        resolve(userDetail.data);
      } catch (error: any) {
        resolve(error);
      }
    });
  }
  async getLinkedInAccessToken(code: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const params = {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: 'http://13.233.87.102:9800',
          client_id: '78xmjwb0liev5n',
          client_secret: 'Fm9GtoVtmgj34wN0',
        };

        const data = await axios.post(
          'https://www.linkedin.com/oauth/v2/accessToken',
          qs.stringify(params),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        );
        // let data = qs.stringify({
        //   grant_type: 'authorization_code',
        //   code: `${code}`,
        //   client_id: '78xmjwb0liev5n',
        //   client_secret: 'Fm9GtoVtmgj34wN0',
        //   // client_id: '77bg91xe9wltm2',
        //   // client_secret: '4yzPjrCKcxFTXae3',
        //   redirect_uri: 'http://13.233.87.102',
        // });

        // let config = {
        //   method: 'post',
        //   maxBodyLength: Infinity,
        //   url: 'https://www.linkedin.com/oauth/v2/accessToken',
        //   headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded',
        //   },
        //   data: data,
        // };

        // axios
        //   .request(config)
        //   .then((response) => {
        //     let accesstoken = response.data.access_token
        //       .replace(/[\r\n]+/g, '')
        //       .trim();
        //     console.log(accesstoken);
        //     resolve(accesstoken);
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //     resolve(error);
        //   });
      } catch (error: any) {
        resolve(error);
      }
    });
  }


  async getUser(userDetail: any): Promise<LoginResponse> {
    try {
      let db = await getDb();
      let userLoginRepo = await db.getRepository(UserLogin);
      let userLogin: UserLogin = await db.manager.findOne(UserLogin, {
        where: {
          userName: userDetail.emailId != undefined ? userDetail.emailId : '',
        },
      });
      if (userLogin == undefined) {
        let user: any = {};
        user.emailId = userDetail.emailId;
        user.firstName = userDetail.firstName;
        user.lastName = userDetail.lastName;
        user.mobile = userDetail.mobile;
        user.password = defaultPassword;
        user.authType = userDetail.authType;
        let createdUser = await this.createUser(user);
        if (createdUser != undefined) {
          userLogin = await db.manager.findOne(UserLogin, {
            where: {
              userName:
                createdUser.emailId != undefined ? createdUser.emailId : '',
              isActive: 1,
            },
          });

          if (userLogin.isBlocked == 1) {
            let err = new CustomError(
              403,
              'fail',
              'UserBlocked',
              ErrorMessage.UserBlocked,
            );
            throw err;
          }
          if (userLogin.isActive == 1) {
            const user: User = await db.manager.findOne(User, {
              where: {
                userId: userLogin.userId,
                // isActive: 1,
              },
            });
            const userRoles: UserRole[] = await db.manager.find(UserRole, {
              relations: {
                role: true,
              },
              where: {
                userId: userLogin.userId,
                isActive: 1,
              },
            });
            let userDetail: any = {};
            userDetail.userId = user.userId;
            userDetail.firstName = user.firstName;
            userDetail.lastName = user.lastName;
            userDetail.fullName = `${user.firstName} ${user.lastName}`;
            userDetail.emailId = user.emailId;
            userDetail.mobile = user.mobile;
            userDetail.isEmailVerified = user.isEmailVerified;
            userDetail.isMobileVerfied = user.isMobileVerfied;
            // userDetail.profilePicture = user.profilePicture;
            let token = jwt.generateToken(userDetail, {});
            let refreshToken = jwt.generateRefreshToken(userLogin.userId);
            let userLoginDetail: UserLogin = await userLoginRepo.findOne({
              where: { userName: userDetail.email },
            });
            userLoginDetail.refreshToken = refreshToken;
            let currentDate = new Date();
            userLoginDetail.tokenExpireAt = new Date(
              currentDate.getTime() +
              parseInt(refreshTokenExpireTime) * 60 * 60 * 1000,
            );
            userLoginDetail.lastLoginAt = currentDate;
            userLoginDetail.wrongCredentialCounter = 0;
            userLoginDetail = await userLoginRepo.save(userLoginDetail);
            userLoginDetail.lastLoginAt = currentDate;
            userLoginDetail.wrongCredentialCounter = 0;
            userLoginDetail = await userLoginRepo.save(userLoginDetail);
            let userInfo: any = {};
            userInfo.userId = user.userId;
            userInfo.firstName = user.firstName;
            userInfo.lastName = user.lastName;
            userInfo.emailId = user.emailId;
            userInfo.mobile = user.mobile;
            userInfo.fullName = `${user.firstName} ${user.lastName}`;
            userInfo.roles = [];
            userInfo.token = token;
            userInfo.refreshToken = userLoginDetail.refreshToken;
            userInfo.isProfileCreated = user.isProfileCreated;
            // userInfo.tokenExpiredAt = new Date();
            let loginDetail = plainToClass(LoginResponse, userInfo, {
              excludeExtraneousValues: true,
            });
            return loginDetail;
          } else {
            let err = new CustomError(
              403,
              'fail',
              'InActiveUser',
              ErrorMessage.InActiveUser,
            );
            throw err;
          }
        }
      } else {
        if (userLogin.isBlocked == 1) {
          let err = new CustomError(
            401,
            'fail',
            'UserBlocked',
            ErrorMessage.UserBlocked,
          );
          throw err;
        }
        if (userLogin.isActive == 1) {
          const user: User = await db.manager.findOne(User, {
            where: {
              userId: userLogin.userId,
              // isActive: 1,
            },
          });
          const userRoles: UserRole[] = await db.manager.find(UserRole, {
            relations: {
              role: true,
            },
            where: {
              userId: userLogin.userId,
              isActive: 1,
            },
          });
          let userDetail: any = {};
          userDetail.userId = user.userId;
          userDetail.firstName = user.firstName;
          userDetail.lastName = user.lastName;
          userDetail.fullName = `${user.firstName} ${user.lastName}`;
          userDetail.emailId = user.emailId;
          userDetail.mobile = user.mobile;
          userDetail.isEmailVerified = user.isEmailVerified;
          userDetail.isMobileVerfied = user.isMobileVerfied;
          // userDetail.profilePicture = user.profilePicture;
          let token = jwt.generateToken(userDetail, {});
          let refreshToken = jwt.generateRefreshToken(userLogin.userId);
          let userLoginDetail: UserLogin = await userLoginRepo.findOne({
            where: { userName: userDetail.email },
          });
          userLoginDetail.refreshToken = refreshToken;
          let currentDate = new Date();
          userLoginDetail.tokenExpireAt = new Date(
            currentDate.getTime() +
            parseInt(refreshTokenExpireTime) * 60 * 60 * 1000,
          );
          userLoginDetail.lastLoginAt = currentDate;
          userLoginDetail.wrongCredentialCounter = 0;
          userLoginDetail = await userLoginRepo.save(userLoginDetail);
          userLoginDetail.lastLoginAt = currentDate;
          userLoginDetail.wrongCredentialCounter = 0;
          userLoginDetail = await userLoginRepo.save(userLoginDetail);
          let userInfo: any = {};
          userInfo.userId = user.userId;
          userInfo.firstName = user.firstName;
          userInfo.lastName = user.lastName;
          userInfo.emailId = user.emailId;
          userInfo.mobile = user.mobile;
          userInfo.fullName = `${user.firstName} ${user.lastName}`;
          userInfo.roles = [];
          userInfo.token = token;
          userInfo.isProfileCreated = user.isProfileCreated
          userInfo.refreshToken = userLoginDetail.refreshToken;
          // userInfo.tokenExpiredAt = new Date();
          let loginDetail = plainToClass(LoginResponse, userInfo, {
            excludeExtraneousValues: true,
          });
          return loginDetail;
        } else {
          let err = new CustomError(
            403,
            'fail',
            'InActiveUser',
            ErrorMessage.InActiveUser,
          );
          throw err;
        }
      }
    } catch (error: any) {
      throw error;
    }
  }

  // function to get login details of user
  async getLoginDetail(userId: string): Promise<LoginResponse> {
    // return new Promise(async (resolve, reject) => {
    let db = await getDb();
    try {
      let userLogin: UserLogin = await db.manager.findOne(UserLogin, {
        where: {
          userId: userId != undefined ? userId : '',
        },
      });

      //----------------------------------------------- checking if user is block for any reason
      if (userLogin.isBlocked == 1) {
        let err = new CustomError(
          403,
          'fail',
          'UserBlocked',
          ErrorMessage.UserBlocked,
        );
        throw err;
      }

      //----------------------------------------------- if user is active
      if (userLogin.isActive == 1) {
        let user: User = await db.manager.findOne(User, {
          where: {
            userId: userLogin.userId,
            // isActive: 1,
          },
        });
        const userRoles: UserRole[] = await db.manager.find(UserRole, {
          relations: {
            role: true,
          },
          where: {
            userId: userLogin.userId,
            isActive: 1,
          },
        });

        let userDetail: any = {};
        userDetail.userId = user.userId;
        userDetail.firstName = user.firstName;
        userDetail.lastName = user.lastName;
        userDetail.fullName = `${user.firstName} ${user.lastName}`;
        userDetail.emailId = user.emailId;
        userDetail.mobile = user.mobile;
        userDetail.isEmailVerified = user.isEmailVerified;
        userDetail.isMobileVerfied = user.isMobileVerfied;
        // userDetail.profilePicture = user.profilePicture;
        let token = jwt.generateToken(userDetail, {});

        let refreshToken = jwt.generateRefreshToken(userLogin.userId);
        let userLoginRepo = await db.getRepository(UserLogin);
        let userLoginDetail: UserLogin = await userLoginRepo.findOne({
          where: { userId: userDetail.userId },
        });
        if (!userLoginDetail) {
          let err = new CustomError(
            401,
            'fail',
            'UserNotFound',
            ErrorMessage.UserNotFound,
          );
          throw err;
        }
        userLoginDetail.refreshToken = refreshToken;
        let currentDate = new Date();
        userLoginDetail.tokenExpireAt = new Date(
          currentDate.getTime() +
          parseInt(refreshTokenExpireTime) * 60 * 60 * 1000,
        );
        userLoginDetail.lastLoginAt = currentDate;
        userLoginDetail.accessToken = token;
        userLoginDetail.wrongCredentialCounter = 0;
        let updatedUserLoginDetail = await userLoginRepo.save(userLoginDetail);

        let userInfo: any = {};
        userInfo.userId = user.userId;
        userInfo.firstName = user.firstName;
        userInfo.lastName = user.lastName;
        userInfo.emailId = user.emailId;
        userInfo.mobile = user.mobile;
        userInfo.fullName = `${user.firstName} ${user.lastName}`;
        userInfo.roles = [];
        userInfo.token = token;
        userInfo.isProfileCreated = user.isProfileCreated
        userInfo.refreshToken = updatedUserLoginDetail.refreshToken;
        let loginDetail = plainToClass(LoginResponse, userInfo, {
          excludeExtraneousValues: true,
        });
        return loginDetail;
      } else {
        let err = new CustomError(
          403,
          'fail',
          'InActiveUser',
          ErrorMessage.InActiveUser,
        );
        throw err;
      }
    } catch (error: any) {
      throw error;
    }
    //  });
  }


  async refreshToken(
    refreshToken: string,
    token: string,
  ): Promise<LoginResponse> {
    try {
      let db = await getDb();
      let userLogin: UserLogin = await db.manager.findOne(UserLogin, {
        where: {
          refreshToken: refreshToken != undefined ? refreshToken : '',
        },
      });
      if (userLogin == undefined) {
        let err = new CustomError(
          403,
          'fail',
          'InvalidRefreshToken',
          ErrorMessage.InvalidRefreshToken,
        );
        throw err;
      }
      let decoded = await jwt.getClaimFromToken(token);
      if (!decoded) {
        let err = new CustomError(
          401,
          'fail',
          'Unauthorized',
          ErrorMessage.Unauthorized,
        );
        throw err;
      }
      // decoded.payload.emailId      //----------- to verify emailId
      // decoded.payload.userId      //----------- to verify userId
      // decoded.header.kid      //----------- to verify kid
      if (decoded.payload.userId != userLogin.userId) {
        let err = new CustomError(
          401,
          'fail',
          'Unauthorized',
          ErrorMessage.Unauthorized,
        );
        throw err;
      }
      if (decoded.payload.jti != userLogin.userId) {
        let err = new CustomError(
          401,
          'fail',
          'Unauthorized',
          ErrorMessage.Unauthorized,
        );
        throw err;
      }
      let loginRes: LoginResponse = await this.getLoginDetail(userLogin.userId);
      return loginRes;
    } catch (error: any) {
      throw error;
    }
  }

  private async sendPasswordResetEmail(
    tenantId: string,
    userId: string,
    emailTo: string,
    resetLink: string,
    firstName: string
  ): Promise<void> {
    try {
      const emailData = {
        tenant_id: tenantId,
        user_id: userId,
        email_to: emailTo,
        email_cc: '',
        email_from: 'info@categorytech.com',
        placeholders: {
          user_name: firstName,
          reset_link: resetLink
        }
      };

      // Make the API call to send the password reset email
      const response = await axios.post(
        `${process.env.email_url}/emails/sendPasswordResetEmail`,
        emailData,  // Send data as an object
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      // if (response.status !== 200) {
      //   throw new CustomError(500, 'fail', 'EmailSendError', 'Failed to send password reset email');
      // }
    } catch (err) {
      console.error('Error sending email:', err);
      throw new CustomError(500, 'fail', 'EmailSendError', 'Failed to send password reset email');
    }
  }

}
