import 'reflect-metadata';
import { db } from './_dbs/postgres/db';
import { Request, Response } from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { CustomResponse } from './middlewares/response.middleware';
import { route } from './routes/route.index';
import { app } from './services/app.service';
//------------------------------------------------------------- Db Initializer ----------------------------------------------------------------
import {
  createRoles,
  // createUserTypes,
  createUser,
  createLoginTypes,
  createLogin,
  createUserRoles,
} from './_dbInit/db.init';
import { Encrypt } from './helpers/encrypt';
import { v4 as uuid } from 'uuid';
import { Role } from './entities/role.entity';
import { AuthType } from './entities/authType.entity';

// db.initialize()
//   .then(async () => {
//     //----------------------------------------------------- Primary database feed will goes here
//     // //----------------------------------------------- Role Initialization
//     // let roles: Role[] = [];
//     // let superAdmin = new Role();
//     // superAdmin.roleName = 'superadmin';
//     // superAdmin.roleDesc = 'superadmin';
//     // superAdmin.roleClaim = {};
//     // roles.push(superAdmin);
//     // let newRoles = createRoles(roles);
//     // console.log(newRoles);
//     // //----------------------------------------------- UserType Initialization
//     // let usertypes: UserType[] = [];
//     // let usertype1: UserType = new UserType();
//     // usertype1.typeName = 'Type1';
//     // usertype1.typeDesc = 'Type1';
//     // usertypes.push(usertype1);
//     // let userTypes = createUserTypes(usertypes);
//     // console.log(userTypes);
//     // //----------------------------------------------- User Initialization

//     // //----------------------------------------------- UserType Initialization
//     // let logintypes: LoginType[] = [];
//     // let logintype1: LoginType = new LoginType();
//     // logintype1.typeName = 'google';
//     // logintype1.typeDesc = 'google';
//     // logintypes.push(logintype1);
//     // let logintype2: LoginType = new LoginType();
//     // logintype2.typeName = 'linkedin';
//     // logintype2.typeDesc = 'linkedin';
//     // logintypes.push(logintype2);
//     // let logintype3: LoginType = new LoginType();
//     // logintype3.typeName = 'password';
//     // logintype3.typeDesc = 'password';
//     // logintypes.push(logintype3);
//     // let loginTypes = createLoginTypes(logintypes);
//     // console.log(loginTypes);
//     // // let usersDetail: UserDetail[];
//     // // usersDetail = createUserDetailForCompany(
//     // //   'demo',
//     // //   superAdminUserId,
//     // //   '8700643635',
//     // //   'vrkumar0471@gmail.com',
//     // //   supportUserId,
//     // //   '8700643636',
//     // //   'vrkumar0472@gmail.com',
//     // // );
//     // // const userDetailRepo = CompanyDb.getRepository(UserDetail);
//     // // await userDetailRepo.save(usersDetail);
//     // // const roleRepo = CompanyDb.getRepository(Role);
//     // // await roleRepo.save(roles);
//     // // let usersRole: UserRole[];
//     // // usersRole = createUsersRole('demo', superAdminUserId, supportUserId);
//     // // const usersRoleRepo = CompanyDb.getRepository(UserRole);
//     // // await usersRoleRepo.save(usersRole);
//     console.log('Company Data Source has been initialized!');
//   })
//   .catch((error) => {
//     let err = error;
//     console.log(error);
//   });
//------------------------------------------------------------- end Db Initializer ------------------------------------------------------------
dotenv.config();

const { port } = process.env;
app.use('/api', route);
app.use(CustomResponse);
const httpServer = createServer(app);

httpServer.listen(7200, async () => {
  console.log(`server running on http://localhost:${port}`);
});
