import { Service } from "typedi";
import { RelatedProducts } from "../models/RelatedProducts";
import { RelatedProductsRepository } from "../repositories/RelatedProductsRepository";
import { OrmRepository } from "typeorm-typedi-extensions";


@Service()
export class RelatedProductService {

    constructor(
        @OrmRepository() private repo: RelatedProductsRepository
    ) { }

    public async setRelatedProducts(productId: number, relatedVariantIds: number[]) {

        //Bulk Delete 
        await this.repo.createQueryBuilder().delete().from(RelatedProducts)
            .where('product_id = :pId', { pId: productId }).execute();

        //Bulk Insert
        let rows = [];
        relatedVariantIds.forEach(num => rows.push({ productId, relatedVariantId: num }));

        return await this.repo.createQueryBuilder().insert().into(RelatedProducts)
            .values(rows).execute();

    }

    public async getRelatedVariantIdsByProductId(productId: number) {

        let result = await this.repo.createQueryBuilder('RP')
            .where('RP.product_id = :pId', { pId: productId })
            .select('RP.related_variant_id as relatedVariantIds')
            .getRawMany();

        result = result.map(obj => Number(obj.relatedVariantIds));

        return result;
    }
}