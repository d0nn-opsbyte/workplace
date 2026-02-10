import type { AuthUser } from './auth.js';
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
            userId?: number;
            session: any;
        }
    }
}
//# sourceMappingURL=middleware.d.ts.map