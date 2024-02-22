import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { ProductVariants } from './ProductVariants';

@Entity('product_variant_images')
export class ProductVariantImages {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'image' })
    public image: string;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: 'is_default' })
    public isDefault: number;

    @Column({ name: 'product_variants_id' })
    public productVariantsId: number;
    
    @Column({ name: 'variant_id' })
    public variantId: number;

    @Column({ name: 'image_alt' })
    public imageAlt: string;

    @ManyToOne(type => ProductVariants, productVariants => productVariants.productVariantImages)
    @JoinColumn({ name: 'product_variants_id' })
    public productVariants: ProductVariants;

}
