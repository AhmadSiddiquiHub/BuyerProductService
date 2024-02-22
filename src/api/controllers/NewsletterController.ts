import 'reflect-metadata';
import { JsonController, Res, Req, Post, Body } from 'routing-controllers';
import { NewsLetterRequest, UnsubscribeNewsLetterRequest } from './requests';
import { EmailService } from '../services/EmailsService';
import { NewsLetterService } from '../services/NewsLetterService';
import { NewsLetter } from '../models/NewsLetter';
import jwt from 'jsonwebtoken';
import { env } from '../../env';


@JsonController('/newsletter')
export class NewsletterController {
    constructor(
        private emailService: EmailService,
        private newsletterService: NewsLetterService,
    ) {}

    // /api/buyer/products/newsletter/unsubscribe-newsletter-request
    @Post('/unsubscribe-newsletter-request')
    public async unsubscribeNewsletterRequest(@Body({ validate: true }) params: UnsubscribeNewsLetterRequest, @Req() request: any, @Res() response: any): Promise<any> {
        try {
            const decoded: any = await jwt.verify(params.key, env.jwtSecret);
            console.log('decoded', decoded);
            const newsLetterRecord = await this.newsletterService.findOne({ where: { email: decoded.email, isSubscribed: 1 }});
            if (!newsLetterRecord) {
                return response.status(404).send({ status: 0, message: 'Not subscribed!', data: {}});
            }
            if (newsLetterRecord.isSubscribed === 0) {
                return response.status(200).send({ status: 1, message: 'You are already unsubscribed to our newsletter', data: {}});
            }
            newsLetterRecord.isSubscribed = 0;
            await this.newsletterService.update(newsLetterRecord.id, newsLetterRecord);
        } catch (error) {
            return response.status(400).send({ status: 0, message: 'Invalid key!', data: {}});
        }

        try {
            const decoded: any = await jwt.verify(params.key, env.jwtSecret);
            await this.emailService.unsubNewsLetter(decoded.email, request.siteId);
            return response.status(200).send({ status: 1, message: 'You have successfully unsubscribed our newsletter', data: {} });
        } catch (error) {
            console.log('error', error);
            return response.status(200).send({ status: 1, message: 'You have successfully unsubscribed our newsletter', data: {} });
        }
    }

    // /api/buyer/products/newsletter/subscribe-newsletter
    @Post('/subscribe-newsletter')
    public async subscribeNewsletter(@Body({ validate: true }) params: NewsLetterRequest, @Req() request: any, @Res() response: any): Promise<any> {
        const siteId = request.siteId;
        const email = params.email;
        if (!email) {
            return response.status(400).send({ status: 1, message: 'Enter email', data: {} });
        }
        const checkRecord = await this.newsletterService.findOne({where: { email, isSubscribed: 0 }})
        if(checkRecord) {
            checkRecord.isSubscribed = 1
            await this.newsletterService.update(checkRecord.id, checkRecord)
            return response.status(200).send({ status: 1, message: 'you have successfully subscribed our newsletter', data: {} });
        }
        const newsletter = await this.newsletterService.findOne({ where: { email, isSubscribed: 1 }});
        if (newsletter) {
            const successResponse: any = { status: 1, message: 'you are already subscribed to our newsletter', data: {} };
            return response.status(200).send(successResponse);
        }
        const newNewsLetter = new NewsLetter();
        newNewsLetter.email = email;
        await this.newsletterService.create(newNewsLetter);
        const encodedString = jwt.sign({ email }, env.jwtSecret);
        await this.emailService.newsLetter(email, encodedString, siteId);
        return response.status(200).send({ status: 1, message: 'you have successfully subscribed our newsletter', data: {} });
    }
}
