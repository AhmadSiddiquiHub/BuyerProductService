import { Entity, PrimaryColumn,} from 'typeorm';

@Entity('coupon_categories')
export class CouponCategory {


    @PrimaryColumn({ name: 'coupon_id' })
    public couponId: number;

    @PrimaryColumn({ name: 'category_id' })
    public categoryId: number;

}
