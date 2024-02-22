import { Column, Entity, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn /* ManyToOne, JoinColumn*/ } from 'typeorm';

import moment = require('moment/moment');
// import { Order } from './Order';
// import { CouponUsage } from './CouponUsage';
// import { OrderProduct } from './OrderProduct';
import { IsNotEmpty } from 'class-validator';
import { AppLevelDateTimeFormat } from '../utils';
@Entity('coupon_usage_product')
export class CouponUsageProduct {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;
    @IsNotEmpty()
    @Column({ name: 'coupon_usage_id' })
    public couponUsageId: number;

    @Column({ name: 'customer_id' })
    public customerId: number;
    @IsNotEmpty()
    @Column({ name: 'order_id' })
    public orderId: number;
    @IsNotEmpty()
    @Column({ name: 'order_product_id' })
    public orderProductId: number;

    @Column({ name: 'quantity' })
    public quantity: number;

    @Column({ name: 'amount' })
    public amount: number;

    @Column({ name: 'discount_amount' })
    public discountAmount: number;

    // @ManyToOne(type => CouponUsage, couponUsage => couponUsage.couponUsageProduct)
    // @JoinColumn({ name: 'coupon_usage_id' })
    // public couponUsage: CouponUsage[];

    // @ManyToOne(type => Order, order => order.couponUsageProduct)
    // @JoinColumn({ name: 'order_id' })
    // public order: Order[];

    // @ManyToOne(type => OrderProduct, orderProduct => orderProduct.couponUsageProduct)
    // @JoinColumn({ name: 'order_product_id' })
    // public orderProduct: OrderProduct[];

    @Column({ name: 'created_at' })
    public createdAt: string;

    @Column({ name: 'updated_at' })
    public updatedAt: string;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updatedAt = moment().format(AppLevelDateTimeFormat);
    }
}
