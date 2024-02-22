import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { DocumentsRepository } from '../repositories/DocumentsRepository';

@Service()
export class DocumentsService {

    constructor(
        @OrmRepository() private repo: DocumentsRepository) {
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
