import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { UserBrowsers } from '../models/UserBrowsers';
import { UserBrowsersRepository } from '../repositories/UserBrowsersRepository';

@Service()
export class UserBrowserService {

    constructor(
        @OrmRepository() private userBrowsersRepository: UserBrowsersRepository) {
    }

    // create customer
    public async create(customer: any): Promise<any> {
        return this.userBrowsersRepository.save(customer);
    }

    public async createNewUserBrwoserLog(user: any, browserId: any): Promise<any> {
        const ubl = new UserBrowsers();
        ubl.userId = user.userId;
        ubl.browserId = browserId;
        ubl.requireOtp = 1;
        const userBrowserLog = await this.create(ubl);
        return userBrowserLog;
    }

    // find Condition
    public findOne(customer: any): Promise<any> {
        return this.userBrowsersRepository.findOne(customer);
    }

    // find Condition
    public findAll(): Promise<any> {
        return this.userBrowsersRepository.find();
    }

    // find Condition
    public find(data: any): Promise<any> {
        return this.userBrowsersRepository.find(data);
    }

    // update customer
    public update(id: any, d: any): Promise<any> {
        console.log('id', id);
        console.log('d', d);
        d.id = id;
        return this.userBrowsersRepository.save(d);
    }
}
