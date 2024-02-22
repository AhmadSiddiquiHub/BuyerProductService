import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { SiteUserRepository } from '../repositories/SiteUserRepository';

@Service()
export class SiteUserService {

    constructor(
        @OrmRepository() private repo: SiteUserRepository) {
    }

    // create customer
    public async create(customer: any): Promise<any> {
        return this.repo.save(customer);
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
}
