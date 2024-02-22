
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { VendorProductRepository } from '../repositories/VendorProductRepository';

@Service()
export class VendorProductService {

    constructor(
        @OrmRepository() private repo: VendorProductRepository
        ) {
    }
    private sq = `(SELECT pv.id FROM product_variants pv WHERE pv.product_variant_values_id = SubOrder.variant AND pv.product_id = SubOrder.productId)`;
    public selects = [
        'product.name as name',
        `(SELECT pvi.image FROM product_variant_images pvi WHERE pvi.product_variants_id = ${this.sq} LIMIT 1) as image`,
        'vpv.sku as sku',
       
    ];
    public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }

    public async update(id: any, data: any): Promise<any> {
        data.id = id;
        return this.repo.save(data);
    }

    public async Update(data: any): Promise<any> {
        return this.repo.save(data);
    }
    public find(data: any): Promise<any> {
        return this.repo.find(data);
    }

    public findOne(d: any): Promise<any> {
        return this.repo.findOne(d);
    }

}
