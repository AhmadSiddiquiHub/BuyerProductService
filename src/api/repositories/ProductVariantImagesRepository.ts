import { EntityRepository, Repository } from 'typeorm';
import { ProductVariantImages } from '../models/ProductVariantImages';

@EntityRepository(ProductVariantImages)
export class ProductVariantImagesRepository extends Repository<ProductVariantImages>  {
    public async findActiveImage(data: string): Promise<any> {
        const query: any = await this.manager.createQueryBuilder(ProductVariantImages, 'productVariantImages');
        // query.select(['SUM(orderProduct.total + orderProduct.discountAmount) as productPriceTotal']);
        query.innerJoin('productVariantImages.product', 'product');
        query.where('product.isActive = :isActive',  { isActive: 1});
        query.andWhere('productVariantImages.image = :value1', {value1: data});
        return query.getRawOne();
    }

    public async findImagesByProductVariantIdsArray(array: any): Promise<any> {
        const selects = [
            'I.image as image',
            'I.isDefault as isDefault',
            'I.productVariantsId as productVariantsId',
            'I.variantId as variantId'
        ];
        return this.manager.createQueryBuilder(ProductVariantImages, 'I').select(selects)
        .where('I.isActive = 1')
        .andWhere('I.isDefault = 1')
        .andWhere('I.productVariantsId IN (' + array + ')')
        .getRawMany();
    }
}
