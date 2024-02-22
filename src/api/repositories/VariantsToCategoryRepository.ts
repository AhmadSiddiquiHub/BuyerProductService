import { EntityRepository, Repository } from 'typeorm';
import { VariantsToCategory } from '../models/VariantsToCategory';
import { Variants } from '../models/Variants';
import { ProductVariantValue } from '../models/ProductVariantValue';

@EntityRepository(VariantsToCategory)
export class VariantsToCategoryRepository extends Repository<VariantsToCategory>  {

    public async getVariantsOfCategory(categoryId: number, siteId: number): Promise<any> {
        const selects = [
            'V.id as id',
            'V.name as name',
            'V.type as type',
        ];
        const query: any = await this.manager.createQueryBuilder(VariantsToCategory, 'VTC').innerJoin(Variants, 'V', 'V.id = VTC.variantId');
        query.where('VTC.isActive = 1');
        query.andWhere('VTC.categoryId = :categoryId', { categoryId });
        query.andWhere('VTC.siteId = :siteId', { siteId });
        query.andWhere('VTC.showOnCatalogFilters = 1');
        query.select(selects);
        return query.getRawMany();
    }

    public async getValuesOfVariantsById(variantIds: any, productIds: any): Promise<any> {
        variantIds = variantIds.length === 0 ? [0] : variantIds;
        productIds = productIds.length === 0 ? [0] : productIds;
        const selects = [
            'PVV.id as productVariantValueId',
            'PVV.variantId as variantId',
            'PVV.productId as productId',
            'PVV.value as value',
            'PVV.name as name',
        ];
        const query: any = await this.manager.createQueryBuilder(ProductVariantValue, 'PVV')
        .where('PVV.variantId IN (' + variantIds + ')')
        .andWhere('PVV.productId IN (' + productIds + ')')
        .select(selects)
        return query.getRawMany();
    }
}
