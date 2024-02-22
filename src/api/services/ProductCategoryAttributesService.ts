import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ProductCategoryAttributesRepository } from '../repositories/ProductCategoryAttributesRepository';

@Service()
export class ProductCategoryAttributesService {

    constructor(@OrmRepository() private repo: ProductCategoryAttributesRepository) {
    }

    public async findAttributesByCatId(catId: number): Promise<any> {
        return await this.repo.findAttributesByCatId(catId);
    }
    
    public async sellerProductAttributesWithValues(catId: number, productId: number, vendorId: number, siteId: number): Promise<any> {
        return await this.repo.sellerProductAttributesWithValues(catId, productId, vendorId, siteId);
    }
}
