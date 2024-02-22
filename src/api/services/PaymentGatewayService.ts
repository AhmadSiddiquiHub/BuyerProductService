import { Service } from 'typedi';
import { PaymentMethodTypes, TransactionTypes } from '../utils';
import { PluginService } from './PluginService';
import qs from 'qs';
import axios from 'axios';
import { env } from '../../env';
import { StripeOrder } from "../models/StripeOrder";
import { StripeOrderService } from "./StripeOrderService";

@Service()
export class PaymentGatewayService {

    constructor(
        private pluginService: PluginService,
        private stripeOrderService: StripeOrderService
    ) {}

    public objTostr(d) {
        let keys = Object.keys(d);
        let mapString = '';
        for (let i = 0; i < keys.length; i++) {
            mapString += keys[i] + '=' + d[keys[i]] + '&';
        }
        mapString = mapString.substr(0, mapString.length - 1)
        return mapString;
    }

    public encryptionForAlphalahGateway(st, apg) {
        console.log('apg', apg);
        var CryptoJS = require("crypto-js/core");
        CryptoJS.AES = require("crypto-js/aes");
        const encdata = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(st), CryptoJS.enc.Utf8.parse(apg.ALFAPAY_KEY_1), {
            keySize: 128 / 8,
            iv: CryptoJS.enc.Utf8.parse(apg.ALFAPAY_KEY_2),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return encdata
    }

    public async alfalahProcess(refNo: any, amount: number, process: string): Promise<any> {
        const TransactionReferenceNumber = refNo;
        const TransactionAmount = amount;
        const CryptoJS = require("crypto-js/core");
        const pm = await this.pluginService.findOne({ where: { id: PaymentMethodTypes.alfapay.id }});
        const apg = JSON.parse(pm.pluginAdditionalInfo);
        let returnUrl: any = '';
        if (process === 'checkout'){
            returnUrl = apg.ALFAPAY_RETURN_URL;
        }
        if (process === 'wallet_topup'){
            returnUrl = apg.ALFAPAY_TOPUP_WALLET_RETURN_URL;
        }
        
        let obj: any = {
            HS_RequestHash:"",
            HS_IsRedirectionRequest:'0',
            HS_ChannelId: apg.ALFAPAY_CHANNEL_ID,
            HS_ReturnURL: env.baseUrl + returnUrl,
            HS_MerchantId: apg.ALFAPAY_MERCHANT_ID,
            HS_StoreId: apg.ALFAPAY_STORE_ID,
            HS_MerchantHash: apg.ALFAPAY_MERCHANT_HASH,
            HS_MerchantUsername: apg.ALFAPAY_MERCHANT_USERNAME,
            HS_MerchantPassword: apg.ALFAPAY_MERCHANT_PASSWORD,
            HS_TransactionReferenceNumber: TransactionReferenceNumber,
            handshake:''
        };
        let result = this.objTostr(obj);
        let encrypted = this.encryptionForAlphalahGateway(result, apg);
        obj.HS_RequestHash = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
        // call 1
        const xr = {
            method: 'post',
            url: apg.ALFAPAY_URL_HS,
            data: qs.stringify(obj),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        };
        const response = await axios(xr);
        console.log('response',response.data)
        obj = {
            'AuthToken': '',
            'RequestHash': '',
            'ChannelId': apg.ALFAPAY_CHANNEL_ID,
            'Currency': 'PKR',
            'IsBIN': '0',
            'ReturnURL': env.baseUrl + returnUrl,
            'MerchantId': apg.ALFAPAY_MERCHANT_ID,
            'StoreId': apg.ALFAPAY_STORE_ID,
            'MerchantHash': apg.ALFAPAY_MERCHANT_HASH,
            'MerchantUsername': apg.ALFAPAY_MERCHANT_USERNAME,
            'MerchantPassword': apg.ALFAPAY_MERCHANT_PASSWORD,
            'TransactionTypeId': TransactionTypes.CreditOrDebitCard,
            'TransactionReferenceNumber': TransactionReferenceNumber,
            'TransactionAmount': TransactionAmount
        };
        if (typeof response.data === 'string') {
            obj.AuthToken= JSON.parse(response.data).AuthToken;
        } else {
            obj.AuthToken= response.data.AuthToken;
        }
        result = this.objTostr(obj);
        encrypted = this.encryptionForAlphalahGateway(result, apg);
        obj.RequestHash = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
        const url = await axios({
            method: 'post',
            url: apg.ALFAPAY_URL,
            data: qs.stringify(obj),
            headers: {  "Content-Type": "application/x-www-form-urlencoded" }
        }).then((response) => {
            return response.request.res.responseUrl;
        });
        return {
            status: 1,
            url
        }
    }

    public async stripeCheckoutProcess(order: any, email: any): Promise<any> {
        const pm = await this.pluginService.findOne({ where: { id: PaymentMethodTypes.Stripe.id }}); 
        const pluginInfo = JSON.parse(pm.pluginAdditionalInfo);
        const isObject = typeof order === 'object';
        const amount = isObject ? order.totalAmount : order;
        const total = Math.round(amount * 100);
        const desc = 'No shipping charges applied!';
        const stripe = require('stripe')(pluginInfo.clientSecret);
        const obj = {
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: env.baseUrl + pluginInfo.successRoute + '?session_id={CHECKOUT_SESSION_ID}',
            cancel_url:  env.baseUrl  + pluginInfo.cancelRoute,
            // shipping_address_collection: {
            //     allowed_countries: ['US'],
            // },
            customer_email: email,
            line_items: [{
                name: 'Total Amount',
                amount: total,
                currency: 'usd',
                quantity: 1,
                description: desc,
            }],
        };
        const session = await stripe.checkout.sessions.create(obj);
        if (session && isObject) {
            const stripeOrder = new StripeOrder();
            stripeOrder.orderId = order.orderId;
            stripeOrder.stripeSessionId = session.id;
            await this.stripeOrderService.create(stripeOrder);
           }
        return {
            status: 1,
            url: session.url
        }
        // const pluginInfo = JSON.parse(plugin.pluginAdditionalInfo);
        // const total = Math.round(order.totalAmount * 100);
        // const desc = 'No shipping charges applied asdcadc';
        // console.log(total, desc);
        // const create_payment_json = {
        //     payment_method_types: ['card'],
        //     mode: 'payment',
        //     automatic_tax: {
        //       enabled: true,
        //     },
        //     shipping_address_collection: {
        //       allowed_countries: ['US'],
        //     },
            // line_items: [{
            //     name: 'Total Amount',
            //     amount: total,
            //     currency: 'usd',
            //     quantity: 1,
            //     description: desc,
            // }],
            // line_items: [{
            //   price_data: {
            //       currency: 'usd',
            //       product_data: {
            //           name: 'T-shirt',
            //       },
            //       unit_amount: 2000,
            //       tax_behavior: 'exclusive'
            //   },
            //   quantity: 1,
            // }],
            // shipping_address_collection: {
            //     allowed_countries: ['US', 'CA'],
            // },
            // automatic_tax: {
            //     enabled: true
            // },
            // shipping_options: [
            //     {
            //         shipping_rate_data: {
            //         type: 'fixed_amount',
            //         fixed_amount: {
            //             amount: 1500,
            //             currency: 'usd',
            //         },
            //         display_name: 'Next day air',
            //         delivery_estimate: {
            //             minimum: {
            //             unit: 'business_day',
            //             value: 1,
            //             },
            //             maximum: {
            //             unit: 'business_day',
            //             value: 1,
            //             },
            //         }
            //         }
            //     },
            // {
            //     shipping_rate_data: {
            //     type: 'fixed_amount',
            //     fixed_amount: {
            //         amount: 0,
            //         currency: 'usd',
            //     },
            //     display_name: 'Free shipping',
            //     delivery_estimate: {
            //         minimum: {
            //         unit: 'business_day',
            //         value: 5,
            //         },
            //         maximum: {
            //         unit: 'business_day',
            //         value: 7,
            //         },
            //     }
            //     }
            // },
            // ],
            // line_items: [{
            //     price_data: {
            //         currency: 'usd',
            //         product_data: {
            //             name: 'T-shirt',
            //         },
            //         unit_amount: 2000,
            //         // tax_behavior: 'inclusive'
            //     },
            //     quantity: 1,
            // }],
            // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
        //     success_url: env.baseUrl + pluginInfo.successRoute + '?session_id={CHECKOUT_SESSION_ID}',
        //     cancel_url:  env.baseUrl  + pluginInfo.cancelRoute,
        // };
        // const stripe = require('stripe')(pluginInfo.clientSecret);
        // const session = await stripe.checkout.sessions.create(create_payment_json);
        // console.log('session obj',session)
        // if (session) {
        //     const stripeParams = new StripeOrder();
        //     stripeParams.orderId = order.orderId;
        //     stripeParams.stripeSessionId = session.id;
        //     await this.stripeOrderService.create(stripeParams);
        //    }
        // const s: any = { status: 2, message: 'Redirect to this url', data: { url: session.url }, };
        // return response.status(200).send(s);
    }
}
