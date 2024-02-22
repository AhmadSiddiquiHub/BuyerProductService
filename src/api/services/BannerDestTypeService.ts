import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { BannerDestTypeRepository } from '../repositories/BannerDestTypeRepository';

@Service()
export class ActivityLogService {

    constructor(
        @OrmRepository() private bannerDestTypeRepository: BannerDestTypeRepository) {
    }
     // create customer
     public async create(result: any): Promise<any> {
        return this.bannerDestTypeRepository.save(result);
    }
}
