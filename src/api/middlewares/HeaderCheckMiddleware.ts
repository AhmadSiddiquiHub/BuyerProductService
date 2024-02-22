import * as express from 'express';
import { UserTypes } from '../utils';
import { OtpService } from '../services/OtpService';
import { AuthService } from '../../auth/AuthService';
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';

@Middleware({ type: 'before' })
export class HeaderCheckMiddleware implements ExpressMiddlewareInterface {
    constructor(
        private otpService: OtpService,
        private authService: AuthService,
    ) {}
    
    public async use(request: any, response: express.Response, next: express.NextFunction): Promise<any> {
        console.log('request.body', request.body);
        request.deviceId = request.header('deviceId');
        const domainHost = request.header('Origin');
        console.log('domainHost ', domainHost);
        let siteId = 1;
        if (domainHost) {
            if (domainHost.includes('.pk')) {
                siteId = 1;
            }
            if (domainHost.includes('.in')) {
                siteId = 2;
            }
            if (domainHost.includes('.com')) {
                siteId = 3;
            }
        }
        console.log('header --------------------------------------------------------', request.header('siteId'));
        if (request.header('siteId')) {
            siteId = Number(request.header('siteId'));
        }
        if (siteId == 1) {
            request.currencySymbol = 'Rs.';
        }
        if (siteId == 2) {
            request.currencySymbol = '₹';
        }
        if (siteId == 3) {
            request.currencySymbol = '$';
        }
        request.siteId = siteId.toString();
        console.log('siteId:::', siteId);
        const apiName = request.originalUrl;
        const otpSetting = await this.otpService.findOne(apiName);
        request.otpSetting = otpSetting;
        console.log('apiName::', apiName);
        console.log('otpSetting::', otpSetting);
        const langId = request.header('langId');
        const device = request.header('device');
        request.device = device;
        request.langId = langId;
        // apiArray contains endpoints on which siteId header check is not required
        const apiArray = [
            '/api/stripe-payment/success',
            '/api/stripe-payment/cancel',
            '/api/stripe-payment/failure',
            '/api/alfapayment/response',
            '/api/alfapayment/wallet-topup-response',
            '/api/alfapayment/wallet-topup-response',
            '/api/list/test'
        ];
        if (apiArray.indexOf(apiName) > -1) {

        } else {
            if (!siteId || !langId || !device) {
                // return response.status(400).send({ status: 0, message: 'Invalid Request. Add siteId,langId,device', data: {}});
            }
        }
        // check request header with token and user is valid or not
        const userId = await this.authService.parseBasicAuthFromRequest(request);
        if (userId) {
            const checkuser = await this.authService.validateUser(userId, UserTypes.Buyer);
            if (checkuser) {
                request.user = checkuser;
                if (otpSetting) {
                    // const otpRes = await this.otpService.generateOtp(request.user, request);
                    // return response.status(200).send({
                    //     status: 1,
                    //     message: 'OTP required',
                    //     ...otpRes,
                    //     // data: request.user,
                    // });
                }
            }
        }
        next();
    }
}
