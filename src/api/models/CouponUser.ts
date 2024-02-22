import { Entity, JoinColumn, ManyToOne, PrimaryColumn, } from 'typeorm';
import { Users } from './Users';
@Entity('coupon_users')
export class CouponUser {

    @PrimaryColumn({ name: 'coupon_id' })
    public couponId: number;

    @PrimaryColumn({ name: 'user_id' })
    public userId: number;
    
    @ManyToOne(type => Users, users => users.couponUsers)
    @JoinColumn({ name: 'user_id' })
    public users: Users[];
}
