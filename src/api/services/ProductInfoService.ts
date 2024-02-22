import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ProductInfoRepository } from '../repositories/ProductInfoRepository';

@Service()
export class ProductInfoService {

    constructor(
        @OrmRepository() private repo: ProductInfoRepository) {
    }

    public async create(customer: any): Promise<any> {
        return this.repo.save(customer);
    }
}
