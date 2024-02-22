import { EntityRepository, Repository } from 'typeorm';
import { ProductRating } from '../models/ProductRating';

@EntityRepository(ProductRating)
export class ProductRatingsRepository extends Repository<ProductRating>  {

    public async ratingConsolidate(id: number): Promise<any> {

        const consolidate = await this.manager.createQueryBuilder(ProductRating, 'rating')
            .select(['COUNT(rating.rating) as RatingCount'])
            .addSelect(['SUM(rating.rating) as RatingSum'])
            .where('rating.productId = :productId', { productId: id })
            .andWhere('rating.isActive = :value', { value: 1 })
            .getRawOne();
        return consolidate;
    }

    // rating statistics
    public async ratingStatistics(id: number): Promise<any> {
        const selects = [
            'COUNT(PR.rating) as rating',
        ];
        const query: any = await this.manager.createQueryBuilder(ProductRating, 'PR');
        query.select(selects);
        query.addSelect(['COUNT(PR.review) as review']);
        query.where('PR.productId = :productId', { productId: id });
        query.andWhere('PR.isActive = :value', { value: 1 });
        query.andWhere('PR.isApproved = :value', { value: 1 });
        return query.getRawOne();
    }

    public async ratingConsolidateForVendor(id: number): Promise<any> {

        const consolidate = await this.manager.createQueryBuilder(ProductRating, 'rating')
            .select(['COUNT(rating.rating) as RatingCount'])
            .addSelect(['SUM(rating.rating) as RatingSum'])
            .innerJoin('rating.product', 'product')
            .innerJoin('product.vendorProducts', 'vendorProducts')
            .where('vendorProducts.vendorId = :vendorId', { vendorId: id })
            .andWhere('rating.isActive = :value', { value: 1 })
            .getRawOne();
        return consolidate;
    }
}
