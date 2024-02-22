import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { VendorProductCategoryRepository } from '../repositories/VendorProductCategoryRepository';

@Service()
export class VendorProductCategoryService {

    constructor(
        @OrmRepository() private repo: VendorProductCategoryRepository) {
    }

    public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }
    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }
}
