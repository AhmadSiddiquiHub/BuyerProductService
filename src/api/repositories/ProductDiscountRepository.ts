import {EntityRepository, Repository} from 'typeorm';
import {ProductDiscount} from '../models/ProductDiscount';

@EntityRepository(ProductDiscount)
export class ProductDiscountRepository extends Repository<ProductDiscount> {

    

    public async findByVariantId(id: number): Promise<any> {
        const selects = [
            'pd.price as price',
            'pd.startDate as startDate',
            'pd.endDate as endDate',
            'pd.vendorProductVariantId as vendorProductVariantId',
            'pd.id as productDiscountId',
        ];
        const query: any = await this.manager.createQueryBuilder(ProductDiscount, 'pd')
        .select(selects)
        .where('pd.vendorProductVariantId = :id ', { id })
        .andWhere('NOW() BETWEEN pd.startDate AND pd.endDate')
        .orderBy('pd.price', 'ASC')
        return query.getRawOne();
    }
    public async getAll_VariantDiscounts_OfProduct(ids: any): Promise<any> {
        console.log('ids', ids);
        if (ids.length === 0) {
            return [];
        }
        const selects = [
            'pd.price as price',
            'pd.startDate as startDate',
            'pd.endDate as endDate',
            'pd.vendorProductVariantId as vendorProductVariantId',
            'pd.id as productDiscountId',
        ];
        const query: any = await this.manager.createQueryBuilder(ProductDiscount, 'pd')
        .select(selects)
        .where('pd.vendorProductVariantId IN (' + ids + ')')
        .andWhere('NOW() BETWEEN pd.startDate AND pd.endDate')
        .orderBy('pd.price', 'ASC');
        return query.getRawMany();
    }
}
