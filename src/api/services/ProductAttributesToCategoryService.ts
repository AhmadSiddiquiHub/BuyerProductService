import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { AttributesToCategoryRepository } from '../repositories/AttributesToCategoryRepository';

@Service()
export class ProductAttributesToCategoryService {

    constructor(@OrmRepository() private repo: AttributesToCategoryRepository) {}

    public async getProductAttributes(catId: number): Promise<any> {
        return await this.repo.getProductAttributes(catId);
    }
    
    public async getProductAttributes_Values(ids: any): Promise<any> {
        return await this.repo.getProductAttributes_Values(ids);
    }
    
    public async getDistinctAttributes_ByCategory(categoryId: number): Promise<any> {
        return await this.repo.getDistinctAttributes_ByCategory(categoryId);
    }
}
