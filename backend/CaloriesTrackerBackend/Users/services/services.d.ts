import type { NextFunction, Request, Response } from "express";
export declare class UserService {
    static validateJWT(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=services.d.ts.map