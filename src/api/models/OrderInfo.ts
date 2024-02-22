import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('order_info')
export class OrderInfo {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'order_id' })
    public orderId: number;

    @Column({ name: 'vendor_id' })
    public vendorId: number;

    @Column({ name: 'product_id' })
    public productId: number;

    @Column({ name: 'sub_order_id' })
    public subOrderId: number;

    @Column({ name: 'shipping_charges' })
    public shippingCharges: number;
}
