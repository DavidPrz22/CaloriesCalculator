// nodeApp/routes.ts
import { Router } from 'express';
import { getPublicCaloriesRoutes, getPrivateCaloriesRoutes } from '../Calories/routes';
import { getPublicUserRoutes, getPrivateUserRoutes } from '../Users/routes';
import { UserService } from '../Users/services/services';
export const getAppRoutes = () => {
    const masterRouter = Router();
    // --- 1. GLOBAL PUBLIC ROUTER ---
    const publicRouter = Router();
    publicRouter.use('/calories', getPublicCaloriesRoutes());
    publicRouter.use('/users', getPublicUserRoutes());
    // --- 2. GLOBAL PRIVATE ROUTER ---
    const privateRouter = Router();
    privateRouter.use(UserService.validateJWT);
    privateRouter.use('/calories', getPrivateCaloriesRoutes());
    privateRouter.use('/users', getPrivateUserRoutes());
    // --- 3. COMBINE THEM ---
    masterRouter.use('/api', publicRouter);
    masterRouter.use('/api', privateRouter);
    return masterRouter;
};
//# sourceMappingURL=routes.js.map