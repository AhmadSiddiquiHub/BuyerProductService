import { Action } from 'routing-controllers';
// import { Container } from 'typedi';
import { Connection } from 'typeorm';
// import { Logger } from '../lib/logger';
// import { AuthService } from './AuthService';
// import { UserTypes } from '../api/utils';

export function authorizationChecker(connection: Connection): (action: Action, roles: string[]) => Promise<any> | any {
    // const log = new Logger(__filename);
    // const authService = Container.get<AuthService>(AuthService);

    return async function innerAuthorizationChecker(action: Action, roles: any): Promise<any> {
        if (roles[0] === 'customer') {
            if (action.request.user) {
                return true;
            }   
        }
        return false;
        // const userId = await authService.parseBasicAuthFromRequest(action.request);
        // if (userId === undefined) {
        //     log.warn('No credentials given (userId)');
        //     return false;
        // }
        // Check the token is revocked or not
        // const checkRevoke = await authService.checkTokenExist(action.request);
        // if (!checkRevoke) {
        //     log.warn('Invalid token');
        //     return false;
        // }
        // if (roles[0] === 'customer') {
        //     action.request.user = await authService.validateCustomer(userId, UserTypes.Buyer);
        //     if (action.request.user === undefined) {
        //         log.warn('Customer Invalid credentials given');
        //         return false;
        //     }
        //     log.info('Successfully checked credentials');
        //     return true;
        // }
        // if (roles[0] === 'seller') {
        //     action.request.user = await authService.validateSeller(userId, UserTypes.Seller);
        //     console.log('action.request.user', userId, action.request.user);
        //     if (action.request.user === undefined) {
        //         log.warn('Seller Invalid credentials given');
        //         return false;
        //     }
        //     log.info('Successfully checked credentials');
        //     return true;
        // }
        // action.request.user = await authService.validateUser(userId);
        // if (action.request.user === undefined) {
        //     log.warn('Invalid credentials given');
        //     return false;
        // }
        // log.info('Successfully checked credentials');
        return false;
        // else {
        //     action.request.user = await authService.validateUser(userId);
        //     if (action.request.user === undefined) {
        //         log.warn('Invalid credentials given');
        //         return false;
        //     }
        //     log.info('Successfully checked credentials');
        //     return true;
        // }
    };
}
