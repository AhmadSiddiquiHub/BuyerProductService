// import { Column, Entity, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';

// import moment = require('moment/moment');
// import { VendorCoupon } from './Coupon';
// import { IsNotEmpty } from 'class-validator';
// import { Product } from './Product';
// import { AppLevelDateTimeFormat } from '../utils';

// @Entity('coupon_products')
// export class CouponProducts {
//     @IsNotEmpty()
//     @PrimaryGeneratedColumn({ name: 'id' })
//     public id: number;
//     @IsNotEmpty()
//     @Column({ name: 'coupon_id' })
//     public vendorCouponId: number;

//     @Column({ name: 'product_id' })
//     public productId: number;

//     @Column({ name: 'site_id' })
//     public siteId: number;

//     @ManyToOne(type => VendorCoupon, vendorCoupon => vendorCoupon.couponProducts)
//     @JoinColumn({ name: 'coupon_id' })
//     public vendorCoupon: VendorCoupon;

//     @OneToOne(() => Product, (product) => product.couponProducts)
//     @JoinColumn({ name: 'product_id' })
//     product: Product;

//     @Column({ name: 'created_at' })
//     public createdAt: string;

//     @Column({ name: 'updated_at' })
//     public updatedAt: string;

//     @BeforeInsert()
//     public async createDetails(): Promise<void> {
//         this.createdAt = moment().format(AppLevelDateTimeFormat);
//     }

//     @BeforeUpdate()
//     public async updateDetails(): Promise<void> {
//         this.updatedAt = moment().format(AppLevelDateTimeFormat);
//     }
// }
