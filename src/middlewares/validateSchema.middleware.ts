import { RequestHandler } from 'express';
import Joi from 'joi';
import _ from 'lodash';
import schemas from '../schemas/schema.index';

interface ValidationError {
  message: string;
  // type: string;
}

interface JoiError {
  status: string;
  error: {
    //   original: unknown;
    details: ValidationError[];
  };
}

interface CustomError {
  status: string;
  error: string;
}

// enabled HTTP methods for request data validation
const supportedMethods = ['post', 'put', 'patch', 'delete'];

// Joi validation options
const validationOptions = {
  abortEarly: false, // abort after the last validation error
  allowUnknown: false, // allow unknown keys that will be ignored
  stripUnknown: true, // remove unknown keys from the validated data
};

const SchemaValidator = (useJoiError = true): RequestHandler => {
  return (req, res, next) => {
    let route: string = req.route.path;
    let method: string = req.method.toLowerCase();

    if (_.includes(supportedMethods, method) && _.has(schemas, route)) {
      // get schema for the current route
      let schema: Joi.Schema = _.get(schemas, route);
      let { error, value } = schema.validate(req.body, validationOptions);
      if (error) {
        const customError: CustomError = {
          status: 'fail',
          error: 'Invalid request.',
        };

        const joiError: JoiError = {
          status: 'fail',
          error: {
            //  original: error._original,
            // details: error.details.map(({ message, type }: ValidationError) => ({
            //   message: message.replace(/['"]/g, ""),
            //   type
            // })),
            details: error.details.map(({ message }: ValidationError) => ({
              message: message.replace(/['"]/g, ''),
            })),
          },
        };

        return res.status(422).json(useJoiError ? joiError : customError);
      }
      // validation successful
      req.body = value;
      return next();
    } else {
      return next();
    }
  };
};

export { SchemaValidator };
