import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ProductDiscount } from '../models/ProductDiscount';
import { ProductDiscountRepository } from '../repositories/ProductDiscountRepository';

@Service()
export class ProductDiscountService {
    constructor(
        @OrmRepository() private repo: ProductDiscountRepository
    ) {}

    public findOne(id: any): Promise<ProductDiscount> {
        return this.repo.findOne(id);
    }
    public async findByVariantId(id: number): Promise<any> {
        return await this.repo.findByVariantId(id);
    }

    public async getAll_VariantDiscounts_OfProduct(ids: any): Promise<any> {
        return await this.repo.getAll_VariantDiscounts_OfProduct(ids);
    }
}
