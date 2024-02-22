import { Service } from 'typedi';
import { getConnection  } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { EmailsRepository } from '../repositories/EmailsRepository';
// import { EmailMlService } from './EmailMlService';
import { SitesService } from './SitesService';
import { ProductService } from "./ProductService";
import { MAILService } from '../../auth/mail.services';
import { Emails } from '../models/Emails';
import { EmailMl } from '../models/EmailMl';
import { EmailVariable } from '../models/EmailVariable';
// import { env } from '../../env';
import moment from 'moment-timezone';
import { getRegion } from '../utils';
@Service()
export class EmailService {

    constructor(
        @OrmRepository() private repo: EmailsRepository,
        // private emailMlService: EmailMlService,
        private sitesService: SitesService,
        private productService: ProductService
    ) {}

    public async findAll(condition: any): Promise<any> {
        return this.repo.find(condition);
    }

    public async findOne(emailId: number, langId: number): Promise<any> {
        const selects = [
            'EML.emailId as emailId',
            'EML.langId as langId',
            'EML.subject as subject',
            'EML.body as body',
            'EML.isActive as isActive',
            'EML.CC as CC',
            'EML.BCC as BCC',
        ];
        return getConnection().getRepository(Emails).createQueryBuilder('E').select(selects)
        .innerJoin(EmailMl, 'EML', 'EML.emailId = E.id')
        .where('E.id = :emailId', { emailId })
        .andWhere('EML.langId = :langId', { langId })
        .getRawOne();
    }
    
    public async getVariablesFromDB(): Promise<any> {
        const selects = [
            'EV.name as name',
            'EV.value as value',
        ];
        return getConnection().getRepository(EmailVariable).createQueryBuilder('EV').select(selects).where('EV.isActive = 1').getRawMany();
    }

    public setProductListVariable(values: any, pl: any) {
        let products: any = '';
        values.product_list.forEach(e => {
            const a = {
                product_image: e.image,
                product_name: e.name,
                product_price: e.price,
                product_quantity: e.quantity,
                product_variant: e.variant.map((variant, variantIndex) => {
                    if (variant.name === 'default') {
                        return '';
                    }
                    return `${variant.name}: ${variant.value} `;
                })
            }
            products += pl.value.replace(/\$\{(\w+)\}/g, function(match, cont){
                return typeof a[cont] !== 'undefined' ? a[cont] : match;
            });
        });
        values.product_list = products;
    }

    public setShippingChargesForVendorProducts(sellerProducts) {
        let shArr:any = [];
        sellerProducts.forEach(e => {
            shArr.push(parseFloat(e.shippingCharges))
        });
        const shippingCharges = shArr.reduce((a, b) => a + b)
        return shippingCharges
    }

    public setTotalForVendorProducts(sellerProducts) {
        let ttlArr: any = [];
        sellerProducts.forEach(e => {
            ttlArr.push(parseFloat(e.total));
        });
        const ttl = ttlArr.reduce((a, b) => a + b);
        return ttl;
    }

    public async setMailVariables(variableValues: any, email: any, siteId: number): Promise<any> {
        const siteInfo = await this.sitesService.findOne({ where: { id: siteId }});
        const values = {
            ...variableValues,
            moment,
            bucket_base_url: siteInfo.bucketBaseUrl,
            play_store_app_url: siteInfo.playStoreAppUrl,
            apple_store_app_url: siteInfo.appleStoreAppUrl,
            qr_code_play_store_app: siteInfo.QRCodePlayStoreApp,
            qr_code_apple_store_app: siteInfo.QRCodeAppleStoreApp,
            currency_symbol: siteInfo.currencySymbol,
            buyer_side_website_link: siteInfo.websiteLink,
            twitter_url: siteInfo.twitterLink,
            facebook_url: siteInfo.fbLink,
            pinterest_url: siteInfo.pinterestLink,
            instagram_url: siteInfo.instaLink,
        };
        let emailVariables = await this.getVariablesFromDB();
        // replace from variable default value column
        emailVariables = emailVariables.map(function(ev, i) {
            if (ev.value) {
                ev.value = ev.value.replace(/\$\{(\w+)\}/g, function(match, cont){
                    return typeof values[cont] !== 'undefined' ? values[cont] : match;
                });
                return ev;
            }
            return ev;
        });
        // product_list
        if (values.product_list) {
            const pl = emailVariables.find((e, i) => e.name === '${product_list}');
            if (pl.value) {
                this.setProductListVariable(values, pl);
            }
        }
        // replace body variables from values
        let body = email.body.replace(/\$\{(\w+)\}/g, function(match, cont){
            return typeof values[cont] !== 'undefined' ? values[cont] : match;
        });
        emailVariables.forEach(function(ev, i) {
            body = body.replace(/\$\{(\w+)\}/g, function(match, cont){
                if (ev.value) {
                    if (ev.name === match) {
                        return ev.value;
                    }
                    return match;
                }
                return match;
            });
        });
        console.log(body);
        return body;
    }

    public async onRegister(user: any, siteId: number): Promise<any> {
        const email = await this.findOne(1, 1);
        const values = {
            buyer_name: user.firstName
        };
        const b = await this.setMailVariables(values, email, siteId);
        const body = b;
        const toEmail = user.email;
        const subject = email.subject;
        const cc = email.cc;
        const bcc = email.bcc;
        const mailConf = await this.getMailConf(siteId);
        MAILService.sendMail({ body, subject, toEmail, cc, bcc, mailConf });
        return email;
    }

    public async sendOTPCodeViaEmail(user: any, code: number, siteId: number, expiryInMinutes: any): Promise<any> {
        const email = await this.findOne(2, 1);
        const values = {
            buyer_name: user.firstName ? user.firstName : '',
            otp_code: code,
            expiryInMinutes
        };
        const body = await this.setMailVariables(values, email, siteId);
        const toEmail = user.email;
        const subject = email.subject;
        const cc = email.cc;
        const bcc = email.bcc;
        const mailConf = await this.getMailConf(siteId);
        MAILService.sendMail({ body, subject, toEmail, cc, bcc, mailConf });
        return email;
    }

    public async forgotPassword(user: any, baseUrl: any, encKey: any, siteId: number): Promise<any> {
        const email = await this.findOne(3, 1);
        const redirectUrl = baseUrl;
        const values = {
            buyer_name: user.firstName + ' ',
            reslink: redirectUrl + encKey
        };
        const b = await this.setMailVariables(values, email, siteId);
        const body = b;
        const toEmail = user.email;
        const subject = email.subject;
        const cc = email.cc;
        const bcc = email.bcc;
        const mailConf = await this.getMailConf(siteId);
        MAILService.sendMail({ body, subject, toEmail, cc, bcc, mailConf });
        return email;
    }
    public getMailConf(siteId): Promise<any> {
        return this.sitesService.findOne({ where: { id: siteId }});
    }
    public async newsLetter(toEmail: string, encodedString: string, siteId: number): Promise<any> {
        const email = await this.findOne(4, 1);
        const values = {
            unsubscribed_newsletter_link: encodedString
        };
        const b = await this.setMailVariables(values, email, siteId);
        const body = b;
        const subject = email.subject;
        const cc = email.cc;
        const bcc = email.bcc;
        const mailConf = await this.getMailConf(siteId);
        MAILService.sendMail({ body, subject, toEmail, cc, bcc, mailConf });
        return email;
    }

    public async unsubNewsLetter(toEmail: string, siteId: number): Promise<any> {
        const email = await this.findOne(32, 1);
        console.log("email",email);
        const values = {
            unsubscribed_newsletter_link: "hah"
        };
        const b = await this.setMailVariables(values, email, siteId);
        const body = b;
        const subject = email.subject;
        const cc = email.cc;
        const bcc = email.bcc;
        const mailConf = await this.getMailConf(siteId);
        MAILService.sendMail({ body, subject, toEmail, cc, bcc, mailConf });
        return email;
    }

    public async contactUs(toEmail: string, siteId: number): Promise<any> {
        const email = await this.findOne(7, 1);
        const values = {
            default: 'asd'
        };
        const b = await this.setMailVariables(values, email, siteId);
        const body = b;
        const subject = email.subject;
        const cc = email.cc;
        const bcc = email.bcc;
        const mailConf = await this.getMailConf(siteId);
        MAILService.sendMail({ body, subject, toEmail, cc, bcc, mailConf });
        return email;
    }

    public async orderConfirmation(user: any, order: any, siteId: number): Promise<any> {
        console.log('user', user);
        console.log('user', order);
        const region = getRegion(siteId);
        const email = await this.findOne(5, 1);
        const values = {
            buyer_name: user.firstName,
            order_no: order.orderPrefixId,
            // order_placed_on_date: moment(order.datetime).format('MMMM Do YYYY, h:mm a'),
            order_placed_on_date: moment().tz(region).format('MMMM Do YYYY, h:mm a'),
            product_list_title: 'Items Ordered',
            order_subtotal: order.subtotal,
            order_shipping_charges: order.shippingCharges,
            order_total: order.total,
            product_list: order.productDetail
        };
        const b = await this.setMailVariables(values, email, siteId);
        const body = b;
        const toEmail = user.email;
        const subject = email.subject;
        const cc = email.cc;
        const bcc = email.bcc;
        const mailConf = await this.getMailConf(siteId);
        MAILService.sendMail({ body, subject, toEmail, cc, bcc, mailConf });
        return email;
    }

    public async orderCancellation(user: any, order: any, siteId: number, subOrder: any): Promise<any> {
        console.log(order.productDetail);
        console.log(subOrder);
        const email = await this.findOne(11, 1);
        const values = {
            buyer_name: user.firstName + ' ' + user.lastName,
            order_no: order.orderPrefixId,
            order_placed_on_date: moment(order.datetime).utc().format('MMMM Do YYYY, h:mm a'),
            product_list_title: 'Items Cancelled',
            product_list: subOrder
        };
        const b = await this.setMailVariables(values, email, siteId);
        const body = b;
        const toEmail = user.email;
        const subject = email.subject;
        const cc = email.cc;
        const bcc = email.bcc;
        const mailConf = await this.getMailConf(siteId);
        MAILService.sendMail({ body, subject, toEmail, cc, bcc, mailConf });
        return email;
    }

    public async orderTracking(user: any, order: any, siteId: number): Promise<any> {
        const email = await this.findOne(14, 1);
        const values = {
            buyer_name: user.firstName + ' ',
            order_no: order.orderPrefixId,
            order_placed_on_date: moment(order.datetime).format('MMMM Do YYYY, h:mm a'),
            product_list_title: 'Items Tracking',
            order_subtotal: order.subtotal,
            order_shipping_charges: order.shippingCharges,
            order_total: order.total,
            product_list: order.productDetail
        };
        const b = await this.setMailVariables(values, email, siteId);
        const body = b;
        const toEmail = user.email;
        const subject = email.subject;
        const cc = email.cc;
        const bcc = email.bcc;
        const mailConf = await this.getMailConf(siteId);
        MAILService.sendMail({ body, subject, toEmail, cc, bcc, mailConf });
        return email;
    }
    
    public async mailToVendorsOnorder(vendor: any, order: any, siteId: number): Promise<any> {
        const email = await this.findOne(6, 1);
        const sC = parseFloat(this.setShippingChargesForVendorProducts(vendor.sellerProducts));
        const tot = parseFloat(this.setTotalForVendorProducts(vendor.sellerProducts));
        console.log( "vendorkay sellerProducts", vendor.sellerProducts)
        const region = getRegion(siteId);
        const values = {
            buyer_name: vendor.buyerName ? vendor.buyerName : '',
            product_list: vendor.sellerProducts,
            order_no: order.orderPrefixId,
            order_placed_on_date: moment().tz(region).format('MMMM Do YYYY, h:mm a'),
            product_list_title: 'Items Ordered',
            order_subtotal: tot,
            order_shipping_charges: sC,
            order_total: tot + sC
        };
        const b = await this.setMailVariables(values, email, siteId);
        const body = b;
        const toEmail = vendor.sellerEmail;
        const subject = email.subject;
        const cc = email.cc;
        const bcc = email.bcc;
        const mailConf = await this.getMailConf(siteId);
        MAILService.sendMail({ body, subject, toEmail, cc, bcc, mailConf });
        return email;
    }

    public async mailToVendorsOnorderCancel(vendor: any, order: any, siteId: number): Promise<any> {
        const email = await this.findOne(10, 1);
        const values = {
            buyer_name: vendor.sellerName,
            product_list: vendor.sellerProducts,
            order_no: order.orderPrefixId,
            order_placed_on_date: moment(order.datetime).utc().format('MMMM Do YYYY, h:mm a'),
            product_list_title: 'Items Cancelled',
            order_subtotal: order.subtotal,
            order_shipping_charges: order.shippingCharges,
            order_total: order.total,
        };
        const b = await this.setMailVariables(values, email, siteId);
        const body = b;
        const toEmail = vendor.sellerEmail;
        const subject = email.subject;
        const cc = email.cc;
        const bcc = email.bcc;
        const mailConf = await this.getMailConf(siteId);
        MAILService.sendMail({ body, subject, toEmail, cc, bcc, mailConf });
        return email;
    }

    public async mailToVendorsOnorderTracking(vendor: any, order: any, siteId: number): Promise<any> {
        const email = await this.findOne(15, 1);
        const values = {
            buyer_name: vendor.sellerName,
            product_list: vendor.sellerProducts,
            order_no: order.orderPrefixId,
            order_placed_on_date: moment(order.datetime).format('MMMM Do YYYY, h:mm a'),
            product_list_title: 'Items Tracked',
            order_subtotal: order.subtotal,
            order_shipping_charges: order.shippingCharges,
            order_total: order.total,
        };
        const b = await this.setMailVariables(values, email, siteId);
        const body = b;
        const toEmail = vendor.sellerEmail;
        const subject = email.subject;
        const cc = email.cc;
        const bcc = email.bcc;
        const mailConf = await this.getMailConf(siteId);
        MAILService.sendMail({ body, subject, toEmail, cc, bcc, mailConf });
        return email;
    }

    public async quotationMail(emailId: any, langId: any, sellerEmail: any, quantity: any, product: any): Promise<any> {
        // const mailContent = await this.emailMlService.findOne({ where: { emailId, langId } });
        // const message = mailContent.content; // .replace('{name}', this.emailMlService.capitalizeFirstLetter(ukadata.firstName) );
        // // const logo = await this.settingService.findOne();
        // MAILService.quotationMail(message, mailContent.title, sellerEmail, product, quantity);
    }

    public async QuotationMailReply(emailId: any, langId: any, BuyerEmail: any, product: any, reply: any): Promise<any> {
        // const mailContent = await this.emailMlService.findOne({ where: { emailId, langId } });
        // const message = mailContent.content; // .replace('{name}', this.emailMlService.capitalizeFirstLetter(ukadata.firstName) );
        // // const logo = await this.settingService.findOne();
        // MAILService.QuotationMailReply(message, mailContent.title, BuyerEmail, product, reply);
    }

    public datesfortemp() {
        const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayDate = new Date();
        const currdateday = weekday[new Date(todayDate).getDay()];
        const someDate = new Date();
        const numberOfDaysToAdd = 6;
        const result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
        const finaldateday = weekday[new Date(result).getDay()];
        const currdate = currdateday + ' , ' + moment(todayDate).format('Do MMMM');
        const nextdate = finaldateday + ' , ' + moment(result).format('Do MMMM');
        return { currdate , nextdate };
    }

    public async sendEmailToAdminForApprovedRating(user: any, productId: any, rating: any, siteId: number): Promise<any> {
        const product = await this.productService.getProdutDetails(productId);
        const email = await this.findOne(19, 1);
        const bcc = email.BCC ? email.BCC.split(',') : email.BCC;
        let variantValue;
        for (const variant of JSON.parse(product.variant)) {
            if (variant.name === 'default') {
                variantValue = '';
            } else {
                variantValue = `${variant.name}: ${variant.value} `;
            }
        }
        const values ={
            buyer_name: user.firstName,
            rating_title: 'User rated this product',
            product_image: product.image,
            product_name: product.name,
            product_variant: variantValue ? variantValue.toString() : '',
            product_rating_comment: rating.review,
            product_rating: rating.rating

        };
        const body = await this.setMailVariables(values, email, siteId);
        const toEmail: any = [];
        const mailConf = await this.getMailConf(siteId);
        MAILService.sendMail({ body, subject: email.subject, toEmail, cc: email.CC, bcc, mailConf });
        return email;
    }

    public async sendEmailToAdminForApprovedQuestion(siteId: number, user: any, productId: any, question: any): Promise<any> {
        const product = await this.productService.getProdutDetails(productId);
        const email = await this.findOne(20, 1);
        let variantValue;
        for (const variant of JSON.parse(product.variant)) {
            if (variant.name === 'default') {
                variantValue = '';
            } else {
                variantValue = `${variant.name}: ${variant.value} `;
            }
        }
        const values ={
            buyer_name: user.firstName,
            rating_title: 'User asked question',
            product_image: product.image,
            product_name: product.name,
            product_variant: variantValue ? variantValue.toString() : '',
            product_question: question

        };
        const body = await this.setMailVariables(values, email, siteId);
        const mailConf = await this.getMailConf(siteId);
        MAILService.sendMail({ body, subject: email.subject, toEmail: user.email, cc: email.CC, bcc: email.BCC,mailConf });
        return email;
    }
}
