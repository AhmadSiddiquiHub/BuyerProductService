
import ejs from 'ejs';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
// import { mail } from '../env';
import moment from 'moment';
// let obj: any ={ host: mail.HOST, port: mail.PORT, auth: { user: mail.AUTH.user, pass: mail.AUTH.pass }/*tls: { do not fail on invalid certs rejectUnauthorized: false, },*/}
// if(mail.HOST === 'smtp.gmail.com'){
//     obj.secure = mail.SECURE;
// }

interface SendMailFuncInterface {
    subject: string,
    body: string,
    toEmail: string,
    cc: string,
    bcc: string,
    mailConf: any
}
export class MAILService {

    public static sendMail({ subject, body, toEmail, cc, bcc, mailConf }: SendMailFuncInterface): Promise<any> {
        // const BCC = bcc && bcc.includes(',') ? bcc.split(',') : bcc;
        // const mailOptions = {
        //     from: mail.FROM,
        //     to: toEmail,
        //     subject,
        //     html: body,
        //     cc,
        //     bcc: BCC
        // };
        const BCC = bcc && bcc.includes(',') ? bcc.split(',') : bcc;
        const config = JSON.parse(mailConf.email_credentials)

        const mailObj: any = { host: config.MAIL_HOST, port: config.MAIL_PORT, auth: { user: config.MAIL_USERNAME, pass: config.MAIL_PASSWORD }/*tls: { do not fail on invalid certs rejectUnauthoriletzed: false, },*/};
        if(config.MAIL_HOST === 'smtp.gmail.com') {
            mailObj.secure = config.MAIL_SECURE;
        }

        const mailOptions = {
            from: config.MAIL_FROM,
            to: toEmail,
            subject,
            html: body,
            cc,
            bcc: BCC
        };
        return new Promise((resolve, reject) => {
            const transporter = nodemailer.createTransport(smtpTransport(mailObj));
            ejs.renderFile('./views/emails/buyer/mail_template.ejs', { body, moment }, (err, data) => {
                if (err) {
                    throw err;
                } else {
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log('eror aya hai aya hai error aya hai', error);
                            // reject(error);
                            resolve(error);
                        } else {
                            console.log('Email sent');
                            resolve(info);
                        }
                    });
                }
            });
        });
    }
    // public static quotationMail(/*logo: any,*/ emailContent: any, Subject: any, subsemail: any, product: any, quantity  /*redirectUrl: any*/): Promise<any> {
    //     // const productDetailData = undefined;
    //     return new Promise((resolve, reject) => {
    //         const transporter = nodemailer.createTransport(smtpTransport(mailObj));
    //         // ./views/testtemp.ejs
    //         ejs.renderFile('./views/BuyerQuotation.ejs', { emailContent, product, quantity /*logo, , productDetailData, redirectUrl */}, (err, data) => {
    //             if (err) {
    //                 throw err;
    //             } else {
    //                 const mailOptions = { from: mail.FROM, to: subsemail, subject: Subject, html: data };
    //                 transporter.sendMail(mailOptions, (error, info) => {
    //                     if (error) {
    //                         reject(error);
    //                     } else {
    //                         resolve(info);
    //                     }
    //                 });
    //             }
    //         });
    //     });
    // }

    // public static QuotationMailReply(/*logo: any,*/ emailContent: any, Subject: any, subsemail: any, product: any, reply /*redirectUrl: any*/): Promise<any> {
    //     // const productDetailData = undefined;
    //     return new Promise((resolve, reject) => {
    //         const transporter = nodemailer.createTransport(smtpTransport(mailObj));
    //         // ./views/testtemp.ejs
    //         ejs.renderFile('./views/QuotationReply.ejs', { emailContent, product, reply /*logo, , productDetailData, redirectUrl */}, (err, data) => {
    //             if (err) {
    //                 throw err;
    //             } else {
    //                 const mailOptions = { from: mail.FROM, to: subsemail, subject: Subject, html: data };
    //                 transporter.sendMail(mailOptions, (error, info) => {
    //                     if (error) {
    //                         reject(error);
    //                     } else {
    //                         resolve(info);
    //                     }
    //                 });
    //             }
    //         });
    //     });
    // }

}
