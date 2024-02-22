import { Column, Entity, PrimaryColumn } from 'typeorm';



@Entity('related_products')
export class RelatedProducts {

    @PrimaryColumn({ name: 'product_id' })
    productId: number;

    @PrimaryColumn({ name: 'related_variant_id' })
    relatedVariantId: number;

    @Column({ name: 'sort_order' })
    sortOrder: number;

}