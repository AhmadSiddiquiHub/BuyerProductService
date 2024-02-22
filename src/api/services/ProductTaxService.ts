import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ProductTaxRepository } from '../repositories/ProductTaxRepository';
@Service()
export class ProductTaxService {

    constructor(@OrmRepository() private repo: ProductTaxRepository) {
    }

    public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }
    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }

     // update customer
     public update(id: any, customer: any): Promise<any> {
        customer.customerId = id;
        return this.repo.save(customer);
    }

    public async delete(id: number): Promise<any> {
        return await this.repo.delete(id);
    }
}
