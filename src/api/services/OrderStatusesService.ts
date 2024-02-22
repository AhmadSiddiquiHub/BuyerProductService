import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { OrderStatusesRepository } from '../repositories/OrderStatusesRepository';

@Service()
export class OrderStatusesService {

    constructor(
        @OrmRepository() private repo: OrderStatusesRepository) {
    }
    public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }
    public getOrderStatuses(siteId: number, langId: number): Promise<any> {
        return this.repo.getOrderStatuses(siteId, langId);
    }
    
}
