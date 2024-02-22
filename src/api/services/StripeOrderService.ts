import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { StripeOrderRepository } from '../repositories/StripeOrderRepository';

@Service()
export class StripeOrderService {

    constructor(
        @OrmRepository() private repo: StripeOrderRepository) {
    }
     public async create(result: any): Promise<any> {
        return this.repo.save(result);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }
}
