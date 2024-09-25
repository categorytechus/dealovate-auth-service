import Joi, { ObjectSchema } from 'joi';

import {
  SignIn,
  SocialSignIn,
  SignUp,
  RefreshToken,
} from './auth.schema';


const authSignup = Joi.object().keys({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
});

export default {
  '/signIn': SignIn,
  '/socialSignIn': SocialSignIn,
  '/signUp': SignUp,
  '/refreshToken': RefreshToken,
} as { [key: string]: ObjectSchema };
