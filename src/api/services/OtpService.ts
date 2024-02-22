
import moment from 'moment-timezone';
import { Service } from 'typedi';
import { getConnection  } from 'typeorm';
// import { OrmRepository } from 'typeorm-typedi-extensions';
import { OtpSetting } from '../models/OtpSetting';
import { OtpCodes } from '../models/OtpCodes';
import { EmailService } from '../services/EmailsService';
import { SmsService } from '../services/SmsService';
import { UserOtpService } from "../services/OtpCodesService";
import { UserService } from "../services/UserServices"; 
import { getRegion } from '../utils';
@Service()
export class OtpService {

    constructor(
        private emailService: EmailService,
        private smsService: SmsService,
        private userOtpService: UserOtpService,
        private userService: UserService
    ) {}

    public async findOne(apiName: string): Promise<any> {
        const selects = [
            'OS.id as id',
            'OS.apiName as apiName',
            'OS.siteId as siteId',
            'OS.expiryInMinutes as expiryInMinutes',
            'OS.smsOptLen as smsOptLen',
            'OS.emailOtpLen as emailOtpLen',
            'OS.sameOpt as sameOpt',
            'OS.isActive as isActive',
        ];
        return await getConnection().getRepository(OtpSetting).createQueryBuilder('OS').select(selects)
        .where('OS.apiName = :apiName', { apiName })
        .andWhere('OS.isActive = 1')
        .getRawOne();
    }

    public async generateOtp(user: any, request: any): Promise<any> {
        const otpSetting = request.otpSetting;
        const siteId = request.siteId;
        if (!otpSetting) {
            return {
                otp_required: 0,
                email_otp: 0,
                mobile_otp: 0,
                editable: 0
            }
        }
        const smsOptLen = parseInt(otpSetting.smsOptLen);
        const emailOtpLen = parseInt(otpSetting.emailOtpLen);
        const otpCode = new OtpCodes();
        otpCode.userId = user.userId;
        otpCode.apiName = otpSetting.apiName;
        otpCode.isVerified = 0;
        const region = getRegion(siteId);
        otpCode.expiredAt = moment().tz(region).add(otpSetting.expiryInMinutes, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        if(user.emailUpdateAble) {
            otpCode.editAbleField = user.email;
        } else if(user.phoneUpdateAble) {
            otpCode.editAbleField = user.phoneNumber;
        }
        const recentOtpCode = await this.userOtpService.findOne({ where: { userId: user.userId }, order: { id: 'DESC' } });
        const delayTime = 31;
        const currentDateTime = moment().tz(region).format('YYYY-MM-DD HH:mm:ss');
        if(recentOtpCode && recentOtpCode.failOtpAttempts >= 5 && currentDateTime < moment(recentOtpCode.blockedAt).format('YYYY-MM-DD HH:mm:ss')) {
            const minutes = moment(recentOtpCode.blockedAt).diff(currentDateTime, 'minutes');
            return {
                status: 0,
                message: `Your account is temprorily blocked. Please retry after ${minutes || 'few'} minutes`,
                data: {
                    isLocked: 1
                }
            };
        }
        const blockedAt = moment().tz(region).add(delayTime, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        if(recentOtpCode) {
            otpCode.failOtpAttempts = recentOtpCode.failOtpAttempts + 1;
            user.isLocked += 1;
            if(otpCode.failOtpAttempts === 5) {
                otpCode.blockedAt = blockedAt;
                user.lockedAt = blockedAt;
            }
            await this.userService.update(user.userId, user);
        }
        let otpLength: any = 0;
        // checing smsOptLen and send OTP on phone number
        if (user.mobileNumber) {
            if (smsOptLen === 0) {
                otpCode.mobileOtp = 0;
            } else {
                let a = '';
                for (let i = 0; i < smsOptLen - 1; i++) {
                    a += '0';
                }
                const code = Math.floor(parseInt(`1${a}`) + Math.random() * parseInt(`9${a}`));
                otpCode.mobileOtp = code;
                try {
                    console.log('sending otp code on', user.mobileNumber);
                    await this.smsService.sendOTPCodeViaMobile(user, code, siteId);
                    otpLength = smsOptLen;
                } catch (error) {
                    console.log('error', error);
                }
            }
        }
        if (user.email) {
            // checing emailOtpLen and send OTP on email
            if (emailOtpLen === 0) {
                otpCode.emailOtp = 0;
            } else {
                let a = '';
                for (let i = 0; i < emailOtpLen - 1; i++) {
                    a += '0';
                }
                const code = Math.floor(parseInt(`1${a}`) + Math.random() * parseInt(`9${a}`));
                otpCode.emailOtp = code;
                try {
                    console.log('sending email...')
                    await this.emailService.sendOTPCodeViaEmail(user, code, siteId, otpSetting.expiryInMinutes);
                    otpLength = emailOtpLen;
                } catch (error) {
                    console.log('error', error);
                }
            }
        }
        await getConnection().getRepository(OtpCodes).save(otpCode);
        return {
            otp_required: 1,
            email_otp: user.email && emailOtpLen !== 0 ? 1 : 0,
            mobile_otp: user.mobileNumber && smsOptLen !== 0 ? 1 : 0,
            expiredAt: otpCode.expiredAt,
            editable: 0,
            otpLength
        }
    }
}
