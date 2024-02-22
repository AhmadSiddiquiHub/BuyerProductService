import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import { env } from '../../env';
import { UserWishlistService } from './UserWishlistService';
import { SiteSettingsService } from '../services/SiteSettingsService';
import { CartService } from '../services/CartService';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../auth/AuthService';
import { UserAddressesService } from '../services/UserAddressesService';
@Service()
export class FunctionService {

    constructor(
        private authService: AuthService,
        private userWishlistService: UserWishlistService,
        private cartService: CartService,
        private siteSettingsService: SiteSettingsService,
        private userAddressesService: UserAddressesService
    ) {}

    public async generateTokenAndTrackLogin(user: any, request: any): Promise<any> {
        const sitesettings = await this.siteSettingsService.findOne({ where: { siteId: request.siteId, keyName: 'Login_Session_Duration' }});
        const token = jwt.sign({ id: user.userId }, env.jwtSecret, { expiresIn: sitesettings.value });
        // if (user.lType === LoginTypes.FACEBOOK){
        //     token = jwt.sign({ id: user.userId }, env.jwtSecret, { expiresIn: request.body.expiresIn });
        // }
        // const Crypto = require('crypto-js');
        // const ciphertextToken = Crypto.AES.encrypt(token, env.cryptoSecret).toString();
        // request.body.count = 1;
        // const wishlistCount  = await this.productService.userWishListProducts(request);
        const wishlistItems = await this.userWishlistService.find({ where: { userId: user.userId }});
        const cartItems = await this.cartService.find({ where: { userId: user.userId }});
        const address = await this.userAddressesService.userAddress(user.userId);
        const userInfo = {
            vendorProfileCompleted: user.vendorProfileCompleted,
            avatar: user.avatar,
            avatarPath: user.avatarPath,
            email: user.email,
            emailVerified: user.emailVerified,
            firstName: user.firstName,
            lastName: user.lastName,
            id: user.userId,
            mobileNumber: user.mobileNumber,
            phoneVerified: user.mobileVerified,
            walletAmount: user.walletBal,
            step: 0,
            wishlistCount: wishlistItems.length,
            cartCount: cartItems.length,
            notificationCount: 0
        };
        return {
            token,
            user: userInfo,
            address
        };
    }
    
    public async userData(user: any, request: any): Promise<any> {
        const token = request.headers.authorization.split(' ')[0] === 'Bearer' ? request.headers.authorization.split(' ')[1] : '';
        const lastName = user.lastName ? ` ${user.lastName}` : '';
        const userInfo = {
            saveBrowsHist: user.saveBrowsHist,
            vendorProfileCompleted: user.vendorProfileCompleted,
            avatar: user.path + user.avatar,
            email: user.email,
            emailVerified: user.emailVerified,
            firstName: user.firstName + lastName ,
            lastName: '',
            id: user.userId,
            mobileNumber: user.mobileNumber,
            phoneVerified: user.mobileVerified,
            walletAmount: user.walletBal,
        };
        return {
            token: token,
            user: userInfo,
        };
    }

    public async hashPassword(password: any): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public async comparePassword(userPassword: string, requestpPassword: string): Promise<boolean> {
        return await bcrypt.compare(requestpPassword, userPassword);
    }

    public async compareforchangePassword(opassword: string, npassword: string): Promise<boolean> {
        if(opassword===npassword){
            return true;
        }
        else return false
    }

    public async isUserLoggedIn(request: any): Promise<any> {
        return await this.authService.checkTokenExist(request);
    }


    public async ProductTax(price: any, siteId: any) {
        if (siteId == 1 || siteId == 2) {
            return 0;
        }
        const pric = price * 6.5/100;
        return pric;
    }
}
