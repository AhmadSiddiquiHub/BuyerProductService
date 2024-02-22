import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ProductVariantValueRepository } from '../repositories/ProductVariantValueRepository';
import { ProductVariantValue } from '../models/ProductVariantValue';
// import { ProductVariantImages } from '../models/ProductVariantImages';
import { Variants } from '../models/Variants';
import { getConnection  } from 'typeorm';
@Service()
export class ProductVariantValueService {

    constructor(@OrmRepository() private repo: ProductVariantValueRepository) {
    }

    public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }
    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }
    // {
    //     id: 1,
    //     name: 'Color',
    //     type: 'inline',
    //     varientsValue: [
    //         { id: 814, valueName: 'red', varientsId: 1 },
    //         { id: 815, valueName: 'brown', varientsId: 1 },
    //         { id: 816, valueName: 'pink', varientsId: 1 },
    //     ]
    // }
    public async getProduct_Variants(productId: any): Promise<any> {
        const selects = [
            'Variants.id as id',
            'Variants.name as name',
            'Variants.type as type',
            'ProductVariantValue.productId as productId',
        ];
        const query: any = await getConnection().getRepository(ProductVariantValue).createQueryBuilder('ProductVariantValue');
        query.select(selects);
        query.innerJoin(Variants, 'Variants', 'Variants.id = ProductVariantValue.variantId');
        query.groupBy('ProductVariantValue.variantId');
        query.where('ProductVariantValue.productId = :id', { id: productId });
        return query.getRawMany();
    }

    public async varaintValues(productId: any, variantId: any): Promise<any> {
        const s = [
            'ProductVariantValue.variantId as varientsId',
            'ProductVariantValue.value as valueName',
            'ProductVariantValue.name as name',
        ];
        const q: any = await getConnection().getRepository(ProductVariantValue).createQueryBuilder('ProductVariantValue');
        q.select(s);
        q.where('ProductVariantValue.productId = :id', { id: productId });
        q.andWhere('ProductVariantValue.variantId = :id2', { id2: variantId });
        return q.getRawMany();
    }

    public async variantValuesByProductId(productId: any): Promise<any> {
        const selects = [
            'PVV.id as productVariantValueId',
            'PVV.productId as productId',
            'PVV.variantId as variantId',
            'PVV.value as value',
            'Variants.type as type',
            'Variants.name as name',
            // 'PVI.image as image'
        ];
        const query: any = await getConnection().getRepository(ProductVariantValue).createQueryBuilder('PVV').select(selects)
        .innerJoin(Variants, 'Variants', 'Variants.id = PVV.variantId')
        // .leftJoin(ProductVariantImages, 'PVI', 'Variants.id = PVI.variantId AND PVI.isDefault = 1')
        .where('PVV.productId = :id', { id: productId });
        return query.getRawMany();
    }
}
