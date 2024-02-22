import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { PaypalOrderRepository } from '../repositories/PaypalOrderRepository';

@Service()
export class PaypalOrderService {

    constructor(
        @OrmRepository() private repo: PaypalOrderRepository) {
    }
     public async create(result: any): Promise<any> {
        return this.repo.save(result);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }
}
