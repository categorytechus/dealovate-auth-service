import { NextFunction, Request, Response } from 'express';
import { getDb } from '../_dbs/postgres/pgConnection';
import { User } from '../entities/user.entity';

export const authorize = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let db = await getDb();
    const userRepo = db.getRepository(User);
    const user = await userRepo.findOne({
      where: { userId: req[' currentUser'].id },
    });
    console.log(user);
    if (!roles.includes('user')) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};
