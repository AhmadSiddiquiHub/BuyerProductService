import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { BrandsMetaInfoRepository } from '../repositories/BrandsMetaInfoRepository';

@Service()
export class BrandsMetaInfoService {

    constructor(
        @OrmRepository() private repo: BrandsMetaInfoRepository) {
    }
    public async create(result: any): Promise<any> {
        return this.repo.save(result);
    }
    public async save(result: any): Promise<any> {
        return this.repo.save(result);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }
    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }
}
