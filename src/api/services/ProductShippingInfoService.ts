import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ProductShippingInfoRepository } from '../repositories/ProductShippingInfoRepository';

@Service()
export class ProductShippingInfoService {

    constructor(
        @OrmRepository() private repo: ProductShippingInfoRepository) {
    }

    public async create(payload: any): Promise<any> {
        return this.repo.save(payload);
    }
    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }


    public async getSameDayOptsStatus(productId: number) {
        let i = await this.repo.find({ where: { productId } });
        return i;
    }
}
