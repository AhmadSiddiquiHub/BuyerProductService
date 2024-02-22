import { Column, Entity, PrimaryGeneratedColumn,} from 'typeorm';

@Entity('coupon_usage')
export class CouponUsage {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'coupon_id' })
    public couponId: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'order_id' })
    public orderId: number;

    @Column({ name: 'discount' })
    public discount: number;
}
