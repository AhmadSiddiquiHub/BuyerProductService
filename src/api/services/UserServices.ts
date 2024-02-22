import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { UsersRepository } from '../repositories/UsersRepository';
import { Users } from '../models/Users';
import { UserBrowsers } from '../models/UserBrowsers';
import { LoginTypes, validateEmailRegex } from '../utils';
import { FunctionService } from '../services/FunctionService';
import { UserBrowserService } from '../services/UserBrowserService';
import axios from 'axios';
import { ContactRepository } from '../repositories/ContactRepository';

@Service()
export class UserService {

    constructor(
        @OrmRepository() private repo: UsersRepository,
        @OrmRepository() private contactRepository: ContactRepository,
        
        private functionService: FunctionService,
        private userBrowserService: UserBrowserService,
        ) {
    }

    // create customer
    public async create(customer: any): Promise<any> {
        return this.repo.save(customer);
    }

        // create customer
    public async createContact(contact: any): Promise<any> {
        return this.contactRepository.save(contact);
    }


    // find Condition
    public findOne(customer: any): Promise<any> {
        return this.repo.findOne(customer);
    }

    // find Condition
    public findAll(): Promise<any> {
        return this.repo.find();
    }

    // find Condition
    public find(data: any): Promise<any> {
        return this.repo.find(data);
    }

    // update customer
    public update(id: any, customer: any): Promise<any> {
        customer.customerId = id;
        return this.repo.save(customer);
    }

    public async signUpViaFacebook (params: any, user: any, request: any): Promise <any> {
        let isSuccess = false;
        try {
        const {data}  = await axios({
            url:
            "https://graph.facebook.com/v9.0/me?access_token=" + params.token,
            method: "get",
        });
        console.log("response from fb request", data);
        isSuccess = true;
        } catch (err) {
            console.log(
            "There is an error occured while making request to FB Graph API: " + err
            );
        }
        if(isSuccess){
            const {emailOrPhone, fullName, browserId} = params
            if (!user) {
                let isEmail = false;
                if (validateEmailRegex.test(emailOrPhone)) {
                    isEmail = true;
                }
                const newUser = new Users();
                if (isEmail) {
                    newUser.email = emailOrPhone;
                    newUser.emailVerified = 1;
                } else {
                    newUser.mobileNumber = emailOrPhone;
                    newUser.mobileVerified = 1;
                }
                newUser.firstName = fullName;
                newUser.roleId = 1;
                newUser.isActive = 1;
                newUser.lType = LoginTypes.FACEBOOK;
                const newCustomer = await this.repo.save(newUser);
                if (browserId) {
                    const userBrowserLog = new UserBrowsers();
                    userBrowserLog.userId = newCustomer.userId;
                    userBrowserLog.browserId = browserId;
                    userBrowserLog.requireOtp = 1;
                    await this.userBrowserService.create(userBrowserLog);
                }
                // create a token
                const data = await this.functionService.generateTokenAndTrackLogin(newCustomer, request);
                    if (newCustomer) {
                        return{
                            status: 1,
                            message: 'Loggedin successfully.',
                            data
                        };
                    }
            } else {
                if(user.lType === LoginTypes.FACEBOOK){
                    // create a token
                    const data = await this.functionService.generateTokenAndTrackLogin(user, request);
                    return {
                        status: 1,
                        message: 'Loggedin successfully.',
                        data
                    };
                } else {
                    return {
                        status: 1,
                        message: 'You have already registered please login',
                        data: {}
                    };
                }
            }
        } else {
            return {
                status: 0,
                message: 'Invalid fb token',
                data: {}
            };
        }
    }

    public async signUpViaGoogle (params: any, user: any, request: any): Promise <any> {
        let isSuccess = true;
        // try {
        //     // https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=YOUR_TOKEN_HERE
        //     const data  = await axios({
        //         method: 'get',
        //         url: 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + params.token,
        //         withCredentials: true
        //     });
        //     console.log("response from fb request", data);
        //     isSuccess = true;
        // } catch (error) {
        //     console.log("There is an error occured while making request to Google API: ", error);
        // }
        // return 'success';
        if(isSuccess){
            const {emailOrPhone, fullName, browserId} = params
            if (!user) {
                let isEmail = false;
                    if (validateEmailRegex.test(emailOrPhone)) {
                        isEmail = true;
                    }
                    const newUser = new Users();
                    if (isEmail) {
                        newUser.email = emailOrPhone;
                        newUser.emailVerified = 1;
                    } else {
                        newUser.mobileNumber = emailOrPhone;
                        newUser.mobileVerified = 1;
                    }
                newUser.roleId = 1;
                newUser.firstName = fullName;
                newUser.isActive = 1;
                newUser.lType = LoginTypes.GMAIL;
                const newCustomer = await this.repo.save(newUser);
                if (browserId) {
                    const userBrowserLog = new UserBrowsers();
                    userBrowserLog.userId = newCustomer.userId;
                    userBrowserLog.browserId = browserId;
                    userBrowserLog.requireOtp = 1;
                    await this.userBrowserService.create(userBrowserLog);
                }
                // create a token
                const data = await this.functionService.generateTokenAndTrackLogin(newCustomer, request);
                if (newCustomer) {
                    return {
                        status: 1,
                        message: 'Loggedin successfully.',
                        data
                    };
                }
            } else {
                if(user.lType === LoginTypes.GMAIL){
                    // create a token
                    const data = await this.functionService.generateTokenAndTrackLogin(user, request);
                    return {
                        status: 1,
                        message: 'Loggedin successfully.',
                        data
                    };
                } else{
                    return {
                        status: 1,
                        message: 'You have already registered please login',
                        data: {}
                    };
                }
            }
        } else {
            return {
                status: 0,
                message: 'Invalid google token',
                data: {}
            };
        }
    }
        
}
