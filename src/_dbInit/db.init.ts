import { User } from '../entities/user.entity';
import { AuthType } from '../entities/authType.entity';
import { UserLogin } from '../entities/userLogin.entity';
import { Role } from '../entities/role.entity';
import { UserRole } from '../entities/userRole.entity';

import { Encrypt } from '../helpers/encrypt';
import dotenv from 'dotenv';
dotenv.config();

const { defaultPassword } = process.env;

function createRoles(roles: Role[]) {
  let rls: Role[] = [];
  for (let i = 0; i < roles.length; i++) {
    let role = new Role();
    role.roleName = roles[i].roleName;
    role.roleDesc = roles[i].roleDesc;
    role.isActive = 1;
    // role.createdAt = new Date();
    // role.createdBy = 'superadmin';
    // role.updatedAt = new Date();
    // role.updatedBy = 'superadmin';
    rls.push(role);
  }
  return rls;
}

// function createUserTypes(userTypes: UserType[]) {
//   let usrTypes: UserType[] = [];
//   for (let i = 0; i < userTypes.length; i++) {
//     let userType = new UserType();
//     userType.typeName = userTypes[i].typeName;
//     userType.typeDesc = userTypes[i].typeDesc;
//     userType.isActive = 1;
//     userType.createdAt = new Date();
//     userType.createdBy = 'superadmin';
//     userType.updatedAt = new Date();
//     userType.updatedBy = 'superadmin';
//     usrTypes.push(userType);
//   }
//   return usrTypes;
// }

function createUser(superAdminId: string) {
  let user = new User();
  user.userId = superAdminId;
  user.firstName = null;
  user.lastName = null;
  user.emailId = null;
  user.isEmailVerified = 0;
  user.mobile = null;
  user.isMobileVerfied = 0;
 // user.alternateMobile = null;
  user.gender = null;
  user.dob = null;
  user.profilePicture = '';
  user.nationality = '';
  user.otherInfo = '{}';
  user.isActive = 1;
  user.createdAt = new Date();
  user.createdBy = 'superadmin';
  user.updatedAt = new Date();
  user.updatedBy = 'superadmin';
  return user;
}

function createLoginTypes(loginTypes: AuthType[]) {
  let lgnTypes: AuthType[] = [];
  for (let i = 0; i < loginTypes.length; i++) {
    let loginType = new AuthType();
    loginType.typeName = loginTypes[i].typeName;
    loginType.typeDesc = loginTypes[i].typeDesc;
    loginType.isActive = 1;
    loginType.createdAt = new Date();
    loginType.createdBy = 'superadmin';
    loginType.updatedAt = new Date();
    loginType.updatedBy = 'superadmin';
    lgnTypes.push(loginType);
  }
  return lgnTypes;
}

function createLogin(superAdminId: string) {
  let userLogin = new UserLogin();
  userLogin.userId = superAdminId;
  userLogin.hashPassword = Encrypt.encryptPass(defaultPassword);
  userLogin.authType = 'password';
  userLogin.lastLoginAt = null;
  userLogin.userClaim = null;
  userLogin.isBlocked = 0;
  userLogin.isActive = 1;
  userLogin.createdAt = new Date();
  userLogin.createdBy = 'superadmin';
  userLogin.updatedAt = new Date();
  userLogin.updatedBy = 'superadmin';

  return userLogin;
}

function createUserRoles(userRoles: UserRole[]) {
  let usrRoles: UserRole[] = [];
  for (let i = 0; i < userRoles.length; i++) {
    let userRole = new UserRole();
    userRole.userId = userRoles[i].userId;
    userRole.roleId = userRoles[i].roleId;
    userRole.isActive = userRoles[i].isActive;
    userRole.isActive = 1;
    userRole.createdAt = new Date();
    userRole.createdBy = 'superadmin';
    userRole.updatedAt = new Date();
    userRole.updatedBy = 'superadmin';
    usrRoles.push(userRole);
  }
  return usrRoles;
}

export {
  createRoles,
  // createUserTypes,
  createUser,
  createLoginTypes,
  createLogin,
  createUserRoles,
};
