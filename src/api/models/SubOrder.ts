import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import moment = require('moment');
import { Product } from './Product';
import { Order } from './Order';
import { ProductRating } from './ProductRating';
import { AppLevelDateTimeFormat } from '../utils';
import { Users } from './Users';
import { VendorProductVariants } from './VendorProductVariants';
import { UserAddresses } from './UserAddresses';
@Entity('sub_orders')
export class SubOrder {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'order_id' })
    public orderId: number;

    @Column({ name: 'product_id' })
    public productId: number;

    @Column({ name: 'campaign_id' })
    public campaignId: number;

    @Column({ name: 'product_variant_id' })
    public productVariantId: number;

    @Column({ name: 'status_id' })
    public statusId: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'vendor_id' })
    public vendorId: number;

    @Column({ name: 'product_name' })
    public productName: string;

    @Column({ name: 'product_image' })
    public productImage: string;

    @Column({ name: 'product_price' })
    public productPrice: number;

    @IsNotEmpty()
    @Column({ name: 'quantity' })
    public quantity: number;

    @IsNotEmpty()
    @Column({ name: 'total_amount' })
    public totalAmount: number;

    @IsNotEmpty()
    @Column({ name: 'suborder_no' })
    public subOrderNo: string;

    @Column({ name: 'discount' })
    public discount: number;

    @Column({ name: 'variant' })
    public variant: string;

    @IsNotEmpty()
    @Column({ name: 'shipping_charges' })
    public shippingCharges: number;

    @IsNotEmpty()
    @Column({ name: 'shipping_days' })
    public shippingDays: number;

    @IsNotEmpty()
    @Column({ name: 'shipping_type' })
    public shippingType: string;

    @Column({ name: 'created_at' })
    public createdAt: string;

    @Column({ name: 'updated_at' })
    public updatedAt: string;

    @Column({ name: 'view_return_label' })
    public viewReturnLabel: number;

    @Column({ name: 'return_till_date' })
    public returnTillDate: string;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updatedAt = moment().format(AppLevelDateTimeFormat);
    }

    @OneToOne(type => Product, p => p.suborder)
    @JoinColumn({ name: 'product_id' })
    public product: Product;

    @OneToOne(type => Order, p => p.suborderReation)
    @JoinColumn({ name: 'order_id' })
    public orderRelation: Order;

    @OneToOne(type => Users, u => u.subOrderRelation)
    @JoinColumn({ name: 'user_id' })
    public usersRelation: Users;

    @OneToOne(type => UserAddresses, a => a.userAddress)
    @JoinColumn({ name: 'vendor_id' })     // @JoinColumn({ name: 'user_id' })
    public vendorAddress: UserAddresses;

    @OneToOne(type => Users, u => u.subOrderVendorRelation)
    @JoinColumn({ name: 'vendor_id' })
    public vendorRelation: Users;

    @OneToOne(type => VendorProductVariants, vpv => vpv.subOrderRelation)
    @JoinColumn({ name: 'product_id' })
    public vpvrelation: VendorProductVariants;

    @OneToOne(type => ProductRating, p => p.suborder)
    @JoinColumn({ name: 'id' })
    public rating: ProductRating;
}
