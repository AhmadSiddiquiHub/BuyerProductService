import { Entity, JoinColumn, OneToOne, PrimaryColumn,} from 'typeorm';
import { Product } from './Product';

@Entity('coupon_products')
export class CouponProduct {

    @PrimaryColumn({ name: 'coupon_id' })
    public couponId: number;

    @PrimaryColumn({ name: 'product_id' })
    public productId: number;

    @OneToOne(() => Product, (product) => product.couponProducts)
    @JoinColumn({ name: 'product_id' })
    product: Product;

}
