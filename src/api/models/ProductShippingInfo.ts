import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('product_shipping_info')
export class ProductShippingInfo {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'product_id' })
    public productId: number;

    @IsNotEmpty()
    @Column({ name: 'vendor_id' })
    public vendorId: number;

    @IsNotEmpty()
    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'days' })
    public days: number;

    @Column({ name: 'charges' })
    public charges: number;

    @Column({ name: 'type' })
    public type: string;
}
