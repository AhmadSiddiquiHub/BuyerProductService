import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { SubOrderTrackingRepository } from '../repositories/SubOrderTrackingRepository';

@Service()
export class SubOrderTrackingService {

    constructor(
        @OrmRepository() private repo: SubOrderTrackingRepository) {
    }
    public async create(result: any): Promise<any> {
        return this.repo.save(result);
    }
    public async update(id: any, data: any): Promise<any> {
        data.id = id;
        return this.repo.save(data);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }
}
