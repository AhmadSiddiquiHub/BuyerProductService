import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('vendor_product_categories')
export class VendorProductCategory {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'vendor_product_id' })
    public vendorProductId: number;

    @IsNotEmpty()
    @Column({ name: 'category_id' })
    public categoryId: number;

    @Column({ name: 'product_id' })
    public productId: number;

    @Column({ name: 'vendor_id' })
    public vendorId: number;
}
