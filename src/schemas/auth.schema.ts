import Joi from 'joi';
import { CustomError } from '../helpers/validatorCustomError';

const SignIn = Joi.object({
  userName: Joi.string()
    .required()
    .error((errors) => CustomError('userName', errors)),
  password: Joi.string()
    .optional()
    .error((errors) => CustomError('password', errors)),
});
const SocialSignIn = Joi.object({
  loginType: Joi.string()
    .required()
    .error((errors) => CustomError('loginType', errors)),
  token: Joi.string().error((errors) => CustomError('token', errors)),
  code: Joi.string().error((errors) => CustomError('token', errors)),
});

const SignUp = Joi.object({
  firstName: Joi.string()
    .required()
    .error((errors) => CustomError('firstName', errors)),
  lastName: Joi.string()
    .required()
    .error((errors) => CustomError('lastName', errors)),
  emailId: Joi.string()
    .required()
    .error((errors) => CustomError('emailId', errors)),
  mobile: Joi.string()
    .required()
    .error((errors) => CustomError('mobile', errors)),
  password: Joi.string().error((errors) => CustomError('password', errors)),
});



const RefreshToken = Joi.object({
  token: Joi.string()
    .required()
    .error((errors) => CustomError('token', errors)),
  refreshToken: Joi.string()
    .required()
    .error((errors) => CustomError('refreshToken', errors)),
});



export {
  SignIn,
  SocialSignIn,
  SignUp,
  RefreshToken,
};
