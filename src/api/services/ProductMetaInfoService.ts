import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ProductMetaInfoRepository } from '../repositories/ProductMetaInfoRepository';

@Service()
export class ProductMetaInfoService {

    constructor(
        @OrmRepository() private repo: ProductMetaInfoRepository) {
    }

    public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }
}
