import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { SchemaValidator } from '../middlewares/validateSchema.middleware';
import { passport } from '../services/app.service';
const validateRequest = SchemaValidator(true);
const authRoute = Router();
const authCntrl = new AuthController();

authRoute.post('/signIn', validateRequest, authCntrl.signIn);
authRoute.post('/signUp', validateRequest, authCntrl.signUp);
authRoute.post('/validateToken', validateRequest, authCntrl.getValidateToken)
authRoute.post('/socialSignIn', validateRequest, authCntrl.socialSignIn);
authRoute.post('/refreshToken', validateRequest, authCntrl.refreshToken);
authRoute.post(
    '/generatePasswordResetLink',
    validateRequest,
    authCntrl.generatePasswordResetLink,
);

authRoute.post('/resetPassword', validateRequest, authCntrl.resetPassword);
authRoute.post('/testEncrypt', authCntrl.testEncrypt);
authRoute.post('/testDecrypt', authCntrl.testDecrypt);

export { authRoute };
