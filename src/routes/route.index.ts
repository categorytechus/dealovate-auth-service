import express from 'express';
const route = express();

//import { authenticate } from '../middlewares/authenticate.middleware';

import { authRoute } from './auth.route';


route.use('/auth', authRoute);


export { route };
