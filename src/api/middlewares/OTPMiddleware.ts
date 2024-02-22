// import compression from 'compression';
// import * as express from 'express';
// import moment from 'moment';
// import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
// import { getManager } from 'typeorm';
// import { OptSettings } from '../../api/models/OptSettings';
// import { OtpCodes } from '../../api/models/OtpCodes';
// import { Users } from '../../api/models/Users';
// import { decryptToken, UserTypes } from '../utils';

// @Middleware({ type: 'before' })
// export class OTPMiddleware implements ExpressMiddlewareInterface {

//     public async use(req: any, res: express.Response, next: express.NextFunction): Promise<any> {

//         var api_url = req.originalUrl;
//         const otp_settings = getManager().getRepository(OptSettings);
//         const otp_codes = getManager().getRepository(OtpCodes);
//         let user = 0;
//         const checkOtpRequired = await otp_settings.findOne({ where: { apiName: api_url }});

//         if (checkOtpRequired) {
//             // check if user is logged in and token into headers
//             const authorization = req.header('authorization');
//             if (authorization && authorization.split(' ')[0] === 'Bearer') {
//                 if (!authorization) {
//                     return undefined;
//                 }
//                 const UserId = await decryptToken(authorization.split(' ')[1]);
//                 user = UserId;
//             }
//             // check user by email if email exists into body
//             const email = req.body.emailId;
//             if (email) {
//                 const checkUser = await getManager().getRepository(Users).findOne({ where: { email, typeId: UserTypes.Buyer }});
//                 if (checkUser) {
//                     user = checkUser.userId;
//                 }
//             }

//             if (user !== 0) {
//                 const userOTP = new OtpCodes();
//                 userOTP.userId = user;
//                 userOTP.apiName = api_url;
//                 // userOTP.emailOtp = Math.floor(100000 + Math.random() * 900000);
//                 userOTP.emailOtp = 123456;
//                 // userOTP.mobileOtp = Math.floor(1000 + Math.random() * 9000);
//                 userOTP.mobileOtp = 1234;
//                 userOTP.expiredAt = moment().format('YYYY-MM-DD HH:mm:ss');
//                 await otp_codes.create(userOTP);
//                 const successResponse: any = {
//                     status: 1,
//                     message: 'Please verify phone number.',
//                     otp_required: 1,
//                     email_otp: 0,
//                     mobile_otp: 1,
//                 };
//                 return res.status(200).send(successResponse);
//             }
//         }
//         // const siteId: any = req.header('siteId');
//         // if (!siteId || siteId === null || siteId === undefined || siteId === '' || siteId === 0) {
//         //     return res.status(400).json({ status: 1, message: 'Invalid productId' });
//                 // } 
//         // req.siteId = 1;
//         return compression()(req, res, next);
//     }

// }
