import compression from 'compression';
import * as express from 'express';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class CompressionMiddleware implements ExpressMiddlewareInterface {

    public use(req: any, res: express.Response, next: express.NextFunction): any {
        // const siteId: any = req.header('siteId');
        // if (!siteId || siteId === null || siteId === undefined || siteId === '' || siteId === 0) {
        //     return res.status(400).json({ status: 1, message: 'Invalid productId' });
                // }
        // req.siteId = 1;
        return compression()(req, res, next);
    }

}
