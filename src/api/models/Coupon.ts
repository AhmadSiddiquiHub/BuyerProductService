import { Column, Entity, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import moment = require('moment/moment');
import { AppLevelDateTimeFormat } from '../utils';
import { Users } from './Users';

@Entity('coupons')
export class Coupon {

    @PrimaryGeneratedColumn({ name: 'id' })
    public couponId: number;

    @Column({ name: 'vendor_id' })
    public vendorId: number;

    @Column({ name: 'coupon_name' })
    public couponName: string;

    @Column({ name: 'coupon_code' })
    public couponCode: string;

    @Column({ name: 'type' })
    public type: string;

    @Column({ name: 'value' })
    public value: number;

    @Column({ name: 'value_type' }) // 1-> percentage 2 -> amount
    public valueType: number;

    @Column({ name: 'max_usage' })
    public maxUsage: number;

    @Column({ name: 'start_date' })
    public startDate: string;
    
    @Column({ name: 'min_order_amount' })
    public minOrderAmount: number;

    @Column({ name: 'max_discount' })
    public maxDiscount: number;

    @Column({ name: 'end_date' })
    public endDate: string;
    
    @Column({ name: 'is_stackable' })
    public isStackable: number;

    @Column({ name: 'is_signup_coupon' })
    public isSignupCoupon: number;
    
    @Column({ name: 'left_count' })
    public leftCount: number;

    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: 'created_at' })
    public createdAt: string;

    @Column({ name: 'updated_at' })
    public updatedAt: string;

    @Column({ name: 'user_based' })
    public userBased: number;
    
    @ManyToOne(type => Users, users => users.vendorCoupon)
    @JoinColumn({ name: 'vendor_id' })
    public users: Users;
    
    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }
    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updatedAt = moment().format(AppLevelDateTimeFormat);
    }
}




