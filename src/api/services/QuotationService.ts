import { Service } from 'typedi';
import { getConnection } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Product } from '../models/Product';
import { ProductVariantImages } from '../models/ProductVariantImages';
import { ProductVariants } from '../models/ProductVariants';
import { QuotationRepository } from '../repositories/QuotationRepository';

@Service()
export class QuotationService {

    constructor(@OrmRepository() private repo: QuotationRepository) {
    }

    // create address
    public async create(quotation: any): Promise<any> {
        return this.repo.save(quotation);
    }

    public findOne(address: any): Promise<any> {
        return this.repo.findOne(address);
    }
    public find(address: any): Promise<any> {
        return this.repo.find(address);
    }

    public async quotation(productId?: any, limit?: any, offset?: any): Promise<any> {
        const select = [
            'product.name as name',
            'pvi.image as image',
        ];
        const query: any = await getConnection().getRepository(Product).createQueryBuilder('product');
        query.select(select);
        query.innerJoin(ProductVariants, 'pv', 'pv.product_id = product.id');
        query.innerJoin(ProductVariantImages, 'pvi', 'pvi.product_variants_id = pv.id');
        query.where('product.id= :id', { id: productId });
        if (limit && limit > 0) {
            query.limit(limit).offset(offset);
        }
        return query.getRawOne();
    }

    public async update(id: number, address: any): Promise<any> {
        address.id = id;
        return this.repo.save(address);
    }
    public async delete(id: number): Promise<any> {
        await this.repo.delete(id);
        return 1;
    }
    // public find(address: any): Promise<any> {
    //     return this.repo.find(address);
    // }
}
