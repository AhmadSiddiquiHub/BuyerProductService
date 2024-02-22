import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { VariantsToCategoryRepository } from '../repositories/VariantsToCategoryRepository';

@Service()
export class VariantsToCategoryService {

    constructor(
        @OrmRepository() private repo: VariantsToCategoryRepository) {
    }
    public async getVariantsOfCategory(categoryId: number, siteId: number): Promise<any> {
        return this.repo.getVariantsOfCategory(categoryId, siteId);
    }
    public async getValuesOfVariantsById(variantIds: any, productIds: any): Promise<any> {
        return this.repo.getValuesOfVariantsById(variantIds, productIds);
    }
}
