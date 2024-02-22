import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('product_variant_values')
export class ProductVariantValue {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'product_id' })
    public productId: number;

    @Column({ name: 'variant_id' })
    public variantId: number;

    @Column({ name: 'value' })
    public value: string;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'is_active' })
    public isActive: number;

}
