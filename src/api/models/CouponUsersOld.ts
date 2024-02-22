// import { Column, Entity, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn, ManyToOne, JoinColumn /*OneToMany */} from 'typeorm';
// import moment = require('moment/moment');
// // import { Order } from './Order';
// import { Coupon } from './Coupon';
// // import { CouponUsageProduct } from './CouponUsageProduct';
// import { IsNotEmpty } from 'class-validator';
// import { Users } from './Users';
// import { AppLevelDateTimeFormat } from '../utils';
// @Entity('coupon_users_old')
// export class CouponUsers {
//     @IsNotEmpty()
//     @PrimaryGeneratedColumn({ name: 'id' })
//     public id: number;
//     @IsNotEmpty()
//     @Column({ name: 'coupon_id' })
//     public couponId: number;

//     @Column({ name: 'user_id' })
//     public userId: number;
    
//     @Column({ name: 'site_id' })
//     public siteId: number;

//     @ManyToOne(type => VendorCoupon, vendorCoupon => vendorCoupon.couponUsers)
//     @JoinColumn({ name: 'coupon_id' })
//     public vendorCoupon: VendorCoupon[];
//     @ManyToOne(type => Users, users => users.couponUsers)
//     @JoinColumn({ name: 'user_id' })
//     public users: Users[];

//     // @ManyToOne(type => VendorCoupon, vendorCoupon => vendorCoupon.couponUsage)
//     // @JoinColumn({ name: 'coupon_id' })
//     // public vendorCoupon: VendorCoupon[];

//     // @OneToMany(type => CouponUsageProduct, couponUsageProduct => couponUsageProduct.couponUsage)
//     // public couponUsageProduct: CouponUsageProduct[];

//     // @ManyToOne(type => Order, order => order.couponUsage)
//     // @JoinColumn({ name: 'order_id' })
//     // public order: Order[];

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
