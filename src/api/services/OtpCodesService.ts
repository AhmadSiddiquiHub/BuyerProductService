import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { OtpCodesRepository } from '../repositories/OptCodesRepository';

@Service()
export class UserOtpService {

    constructor(
        @OrmRepository() private otpCodesRepository: OtpCodesRepository) {
    }

    // create customer
    public async create(customer: any): Promise<any> {
        return this.otpCodesRepository.save(customer);
    }

    // find Condition
    public findOne(customer: any): Promise<any> {
        return this.otpCodesRepository.findOne(customer);
    }

    // find Condition
    public findAll(): Promise<any> {
        return this.otpCodesRepository.find();
    }

    // find Condition
    public find(data: any): Promise<any> {
        return this.otpCodesRepository.find(data);
    }

    // update customer
    public update(id: any, customer: any): Promise<any> {
        customer.customerId = id;
        return this.otpCodesRepository.save(customer);
    }
}
