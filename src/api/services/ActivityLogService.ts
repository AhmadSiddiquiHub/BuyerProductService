import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ActivityLogRepository } from '../repositories/AcitivityLogRepository';

@Service()
export class ActivityLogService {

    constructor(
        @OrmRepository() private activityLogRepository: ActivityLogRepository) {
    }
     // create customer
     public async create(customer: any): Promise<any> {
        return this.activityLogRepository.save(customer);
    }
}
