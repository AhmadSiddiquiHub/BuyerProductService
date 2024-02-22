import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ProductVariantsRepository } from '../repositories/ProductVariantsRepository';
@Service()
export class ProductVariantsService {

    constructor(@OrmRepository() private repo: ProductVariantsRepository) {
    }

    public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }
    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }
}
