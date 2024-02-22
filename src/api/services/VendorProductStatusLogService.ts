import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import {VendorProductStatusLogRepository} from '../repositories/VendorProductStatusLogRepository';

@Service()
export class VendorProductStatusLogService {

    constructor(@OrmRepository() private repo: VendorProductStatusLogRepository) {
    }

    public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }
}
