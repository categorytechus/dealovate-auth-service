import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import moment from 'moment';
//---------------------------------- for crypto
import crypto from 'crypto';
import appConfig from '../_configs/app/appConfig.json';
const algorithm = 'aes-256-cbc';
//-------------------------------- for crypto
dotenv.config();
const key = Buffer.from(appConfig.secret.encryptionKey, 'base64');
const iv = Buffer.from(appConfig.secret.iv, 'base64');

export class Encrypt {
  static encryptPass(password: string) {
    return bcrypt.hashSync(password, 12);
  }
  static comparePassword(hashPassword: string, password: string) {
    return bcrypt.compareSync(password, hashPassword);
  }
  static generateEncryptedToken(userId: string) {
    let token = `${userId}${moment().clone().format('DDMMMYYYYHHmmssSSSZ')}`;
    return bcrypt.hashSync(token, 12);
  }

  // //-------------------------------------- encryption using crypto
  static encrypt(text: string) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }
  // //-------------------------------------- decryption using crypto
  static decrypt(encryptedText: string) {
    try {
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (err) {
      return undefined;
    }
  }
}
