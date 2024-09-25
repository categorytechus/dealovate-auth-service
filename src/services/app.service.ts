import express from 'express';
import fs = require('fs');
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import xmlparser from 'express-xml-bodyparser';
const passport = require('passport');
const session = require('express-session');
//require('../auth/google.auth');
//const GoogleStrategy = require('passport-google-oauth20').Strategy;
//const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
import dotenv from 'dotenv';
dotenv.config();
const { allowedOrigins } = process.env;
//------------------------------------------------------api Server
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(xmlparser());

//let allowedOrigins: any = 'http://localhost:4200,http://127.0.0.1:4200';
// app.get('/', function (req, res) {
//   res.send('Hello Dealovate');
// });
app.get('/', (req, res) => {
  res.send(
    `<button><a href='/api/auth/googleAuth'>Login With Google</a></button>`,
  );
});
app.use(
  cors({
    origin: function (origin: any, callback) {
      if (!origin) return callback(null, true); //-----------allowing if request from tool like postman
      if (allowedOrigins.indexOf(origin) === -1) {
        // let msg:string = `The CORS policy for this site does not allow access from the specified Origin.`;
        let msg: string = `Request from unknown source`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  }),
);

//---------------------------------------------------------------- google and linkedin login
app.use(
  session({
    secret: 'DealoSupervateSecert',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
//---------------------------------------------------------------- end google and linkedin login

//app.use(authorize);

//app.use('/bills', express.static(path.join(config.dirPath + 'uploads/bills')));
//app.use(ErrorHandler);
//app.use(morganLogger);
export { app, passport };
