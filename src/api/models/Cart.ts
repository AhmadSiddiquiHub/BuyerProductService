import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('cart')
export class Cart {

    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'product_id' })
    public productId: number;

    @Column({ name: 'vendor_id' })
    public vendorId: number;

    @Column({ name: 'product_variant_id' })
    public productVariantId: number;

    @Column({ name: 'quantity' })
    public quantity: number;

    @Column({ name: 'device_id' })
    public deviceId: string;
    
    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'selected_shipping_opt' })
    public selectedShippingOpt: string;
}
