import jwt from 'jsonwebtoken';
import { env } from '../../env';

// Phone Number Regex Validators
// https://github.com/fWd82/Pakistan-Mobile-Number-Validator
// ^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$
// ^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/gm
export const PakistanPhoneNumberlRegex = /^((\+92)?(0)?)(3)([0-9]{9})$/;
// https://stackoverflow.com/questions/18351553/regular-expression-validation-for-indian-phone-number-and-mobile-number
// For India Phone Number Regex
export const IndiaPhoneNumberlRegex = /^((\+91)?(0)?)(9)([0-9]{9})$/gm;
export const validatePhoneNumber = (siteId, phoneNumber) => {
    let status = false;
    switch(siteId) {
        case SitesEnum.Pakistan:
            status = PakistanPhoneNumberlRegex.test(phoneNumber);
            break;
        case SitesEnum.India:
            status = IndiaPhoneNumberlRegex.test(phoneNumber);
            break;
        case SitesEnum.US:
            status = false;
            break;
        default:
            status;
    }
    return status;
}
export const getRegion = (siteId:any) => {
    let region = 'Asia/Karachi';
    switch(siteId) {
        case SitesEnum.Pakistan:
            region = 'Asia/Karachi';
            break;
        case SitesEnum.India:
            region = 'Asia/Kolkata';
            break;
        case SitesEnum.US:
            region = 'America/Los_Angeles';
            break;
        default:
            region;
    }
    return region;
}
export const validateEmailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const AppLevelDateTimeFormat = 'YYYY-MM-DD HH:mm:ss';

export enum SitesEnum {
    Pakistan = '1',
    India = '2',
    US = '3',
}

export enum VendorStatusEnum {
    Active = 'Active',
    InActive = 'InActive',
    InReview = 'InReview'
}

export enum OrderStatusEnum {
    All = 0,
    Pending = 1,
    Placed = 2,
    PackingInProgress = 3,
    Shipped = 4,
    Delivered = 5,
    CancellationPending = 6,
    Cancelled = 7,
    ReturnPending = 8,
    Returned = 9,
    ReturnRequestApproved = 10
}

export enum UserTypes {
    Admin = 'A',
    Buyer = 'B',
    Seller = 'S',
    SuperAdmin = 'U',
}

export enum ProductStatusEnum {
    Active = 'Active',
    ApprovalPending = 'ApprovalPending',
    Approved = 'Approved',
    Draft = 'Draft',
    InActive = 'InActive',
    Rejected = 'Rejected',
}

export enum TransactionTypes {
    AlphalaWallet = '1',
    AlphalaBankAccount = '2',
    CreditOrDebitCard = '3'
}
export enum LoginTypes {
    FACEBOOK = 'Facebook',
    GMAIL = 'Gmail',
    NORMAL = 'Normal',
}

export const PaymentMethodTypes = {
    COD: {
        id: 2,
        type: 'CashOnDelivery',
    },
    Paypal: {
        id: 1,
        type: 'Paypal',
    },
    Stripe: {
        id: 6,
        type: 'Stripe',
    },
    Easypaisa: {
        id: 8,
        type: 'Easypaisa',
    },
    PayUBiz: {
        id: 9,
        type: 'PayUBiz',
    },
    Razorpay: {
        id: 5,
        type: 'Razorpay',
    },
    alfapay: {
        id: 10,
        type: 'AlfaPay',
    },
    // PAYPAL = 'paypal',
    // COD = 'CashOnDelivery',
    // RAZORPAY = 'razorpay',
    // STRIPE = 'stripe',
    // CARD = 'card',
    // EASYPAISA = 'easypaisa',
    // PAYUBIZ = 'payubiz',
};

export const decryptToken = async (token) => {
    return new Promise<number>((subresolve, subreject) => {
        jwt.verify(token, env.jwtSecret, { ignoreExpiration: false }, (err, decoded: any) => {
            if (err) {
               return subresolve(undefined);
            }
            return subresolve(decoded.id);
        });
    });
};

export const decryptTokenWithSecret = async (token, secret) => {
    return new Promise<any>((subresolve, subreject) => {
        jwt.verify(token, secret, { ignoreExpiration: false }, (err, decoded: any) => {
            if (err) {
                console.log('decryptTokenWithSecret', err);
               return subresolve(undefined);
            }
            return subresolve(decoded.id);
        });
    });
};


export function formatPrice(siteId: any, price: any): any {
    if (!price) {
        return '';
    }
    if (typeof price === 'string') {
        price = parseFloat(price);
    }
    if (siteId == 1) {
        price = Math.round(price);
    }
    if (siteId == 2) {
        // price = Math.round(price);
        price = price.toFixed(2);
    }
    if (siteId == 3) {
        price = price.toFixed(2);
    }
    return price.toString();
    // x = "" + parseInt(x);
    // return x.toString().replace(/.(?=(?:.{3})+$)/g, "$&,");
}