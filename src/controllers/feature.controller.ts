import { Request, Response, NextFunction } from 'express';
import { FeatureService } from '../services/feature.service';
import { FeatureResponse } from '../dtoes/feature.dto';
import { Feature } from '../entities/feature.entity';
import { LoggedInUser } from '../dtoes/loggedInUser.dto';
const featureService = new FeatureService();
export class FeatureController {
  async getModules(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: LoggedInUser = req['currentUser'];
      if (loggedInUser) {
        let roles: FeatureResponse[] =
          await featureService.getModules(loggedInUser);
        res.locals.data = roles;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err.message;
    }
    next();
  }

  async getModuleById(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: LoggedInUser = req['currentUser'];
      if (loggedInUser) {
        let moduleId: number = parseInt(req.params.moduleId);
        let module: FeatureResponse = await featureService.getModuleById(
          loggedInUser,
          moduleId,
        );
        res.locals.data = module;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err.message;
    }
    next();
  }

  async getModuleByRole(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: LoggedInUser = req['currentUser'];
      if (loggedInUser) {
        let roleId: number = parseInt(req.params.roleId);
        let feature: any[] = await featureService.getModuleByRole(
          loggedInUser,
          roleId,
        );
        res.locals.data = feature;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err.message;
    }
    next();
  }

  async getModuleByGroup(req: Request, res: Response, next: NextFunction) {
    try {
      let loggedInUser: LoggedInUser = req['currentUser'];
      if (loggedInUser) {
        let groupId: number = parseInt(req.params.groupId);
        let module: any[] = await featureService.getModuleByGroup(
          loggedInUser,
          groupId,
        );
        res.locals.data = module;
      } else {
        res.locals.error = 'Unauthorized';
      }
    } catch (err) {
      res.locals.error = err.message;
    }
    next();
  }

  async addModule(req: Request, res: Response, next: NextFunction) {
    try {
      let feature: Feature = <Feature>req.body;
      let loggedInUser: LoggedInUser = req['currentUser'];
      let addedFeature: FeatureResponse = await featureService.addModule(
        loggedInUser,
        feature,
      );
      res.locals.data = addedFeature;
    } catch (err) {
      res.locals.error = err.message;
    }
    next();
  }

  async updateModule(req: Request, res: Response, next: NextFunction) {
    try {
      let feature: Feature = <Feature>req.body;
      let loggedInUser: LoggedInUser = req['currentUser'];
      let updatedFeature: FeatureResponse = await featureService.updateModule(
        loggedInUser,
        feature,
      );
      if (updatedFeature != undefined) {
        res.locals.data = updatedFeature;
      } else {
        res.locals.data = { message: 'Record not found' };
      }
    } catch (err) {
      res.locals.error = err.message;
    }
    next();
  }

  async removeModule(req: Request, res: Response, next: NextFunction) {
    try {
      let featureId: number = parseInt(req.params.featureId);
      let loggedInUser: LoggedInUser = req['currentUser'];
      let removedFuture: FeatureResponse = await featureService.removeModule(
        loggedInUser,
        featureId,
      );
      if (removedFuture != undefined) {
        res.locals.data = removedFuture;
      } else {
        res.locals.data = { message: 'Record not found' };
      }
    } catch (err) {
      res.locals.error = err.message;
    }
    next();
  }
}
