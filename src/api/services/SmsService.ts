import { Service } from 'typedi';
import { getConnection  } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { SmsRepository } from '../repositories/SmsRepository';
import { twilioCredentials } from '../../env';
import { Sms } from '../models/Sms';
import { SmsMl } from '../models/SmsMl';
import axios from 'axios';
import { SmsVariable } from '../models/SmsVariable';
interface SendSmsFuncInterface {
    mobileNumber: any,
    body: string,
}
@Service()
export class SmsService {

    constructor(
        @OrmRepository() private repo: SmsRepository,
    ) {}

    public async findAll(condition: any): Promise<any> {
        return this.repo.find(condition);
    }

    public async findOne(smsId: number, langId: number): Promise<any> {
        const selects = [
            'SML.smsId as smsId',
            'SML.langId as langId',
            'SML.body as body',
            'SML.isActive as isActive',
        ];
        return getConnection().getRepository(Sms).createQueryBuilder('S').select(selects)
        .innerJoin(SmsMl, 'SML', 'SML.smsId = S.id')
        .where('S.id = :smsId', { smsId })
        .andWhere('SML.langId = :langId', { langId })
        .getRawOne();
    }
    
    public async getVariablesFromDB(): Promise<any> {
        const selects = [
            'SV.name as name',
            'SV.value as value',
        ];
        return getConnection().getRepository(SmsVariable).createQueryBuilder('SV').select(selects).where('SV.isActive = 1').getRawMany();
    }

    public async setSmsVariables(values: any, sms: any): Promise<any> {
        // find more variables like header, footer and so on
        // const smsVariables = await this.getVariablesFromDB();
    
        // replace body variables from values
        let body = sms.body.replace(/\$\{(\w+)\}/g, function(match, cont){
            return typeof values[cont] !== 'undefined' ? values[cont] : match;
        });
        
        // smsVariables.forEach(function(sv, i) {
        //     body = body.replace(/\$\{(\w+)\}/g, function(match, cont){
        //         if (sv.value) {
        //             if (sv.name === match) {
        //                 return sv.value;
        //             }
        //             return match;
        //         }
        //         return match;
        //     });
        // });

        return body;
    }
    public async sendOTPCodeViaMobile(user: any, mobileOtp: any, siteId: any): Promise<any> {
        const sms = await this.findOne(2, 1);
        const mobileNumber = user.mobileNumber;
        const values = {
            buyer_name: user.firstName ? user.firstName : '',
            mobile: mobileNumber,
            otp_code: mobileOtp
        };
        const body = await this.setSmsVariables(values, sms);
        console.log(body)
        if(siteId === '1'){
            this.sendSms({ body , mobileNumber });
        } else {
            this.sendSMSViaTwillio(body, mobileNumber);
        }
        return sms;

    }

    public async orderCancellation(user: any, orderNo: any, siteId: any): Promise<any> {
        const sms = await this.findOne(11, 1);
        const mobileNumber = user.mobileNumber
        const values = {
            buyer_name: user.firstName + ' ',
            mobile: mobileNumber,
            order_no: orderNo
        };
        const body = await this.setSmsVariables(values, sms);
        console.log(body)
        if(siteId === '1'){
            this.sendSms({ body , mobileNumber });
        } else {
            this.sendSMSViaTwillio(body, mobileNumber);
        }
        return sms;

    }

    public async orderConfirmation(user: any, orderNo: any, siteId: any): Promise<any> {
        const sms = await this.findOne(5, 1);
        const mobileNumber = user.mobileNumber
        const values = {
            buyer_name: user.firstName + ' ',
            mobile: mobileNumber,
            order_no: orderNo
        };
        const body = await this.setSmsVariables(values, sms);
        console.log(body)
        if(siteId === '1'){
            this.sendSms({ body , mobileNumber });
        } else {
            this.sendSMSViaTwillio(body, mobileNumber);
        }
        return sms;

    }

    public async sendSms({body, mobileNumber}: SendSmsFuncInterface): Promise<any> {
            /* Telecard */
        try {
            console.log(`Sending Sms to mobile number ${mobileNumber}`);
            const s = await axios.get('https://bsms.telecard.com.pk/SMSportal/Customer/apikey.aspx', {
                params: {
                    apikey: '790304bffa8a4a2582b0962118e61a66',
                    msg: body,
                    mobileno: `${mobileNumber}`
                },
            });
            if (s) {
                console.log(`SMS sent to mobile number ${mobileNumber}`);
            }
        } catch (err) {
            console.log(err);
            console.log(`Could not send SMS to ${mobileNumber}`, err);
        }
    }

    public async sendSMSViaTwillio (body: any, mobileNumber: any): Promise<any> {
        const twilioClient = require('twilio')(twilioCredentials.TWILIO_ACOUNT_SID, twilioCredentials.TWILIO_ACOUNT_AUTH_TOKEN);
        const message = await twilioClient.messages.create({
            body,
            from: twilioCredentials.TWILIO_ACCOUNT_SENDER_NUMBER,
            to: mobileNumber
          });
          if (message.sid && !message.errorCode) {
            console.log(`SMS sent to mobile number:: ${mobileNumber}`);
          } else {
            console.log('error occur while send message in US region');
          }
    }
    
}
