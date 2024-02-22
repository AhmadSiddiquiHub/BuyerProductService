import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { CouponProduct } from './CouponProduct';
import { ProductVariants } from './ProductVariants';
import { SubOrder } from './SubOrder';
import { OpenBoxProductPincodes } from './OpenBoxProductPincodes';
import { SameDayProductPincodes } from './SameDayProductPincodes';
import SectionProducts from './SectionProducts';
@Entity('products')
export class Product {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'long_desc' })
    public longDesc: string;

    @Column({ name: 'more_information' })
    public moreInformation: string;

    @Column({ name: 'short_desc' })
    public shortDesc: string;

    @Column({ name: 'bullet_points' })
    public bulletPoints: string;

    @Column({ name: 'avg_rating' })
    public avgRating: number;

    @Column({ name: 'review_count' })
    public reviewCount: number;

    @Column({ name: 'rating_count_star1' })
    public OneStarRatingCount: number;

    @Column({ name: 'rating_count_star2' })
    public TwoStarRatingCount: number;

    @Column({ name: 'rating_count_star3' })
    public ThreeStarRatingCount: number;

    @Column({ name: 'rating_count_star4' })
    public FourStarRatingCount: number;

    @Column({ name: 'rating_count_star5' })
    public FiveStarRatingCount: number;

    @Column({ name: 'xml' })
    public xml: string;

    @OneToOne(() => CouponProduct, (couponProducts) => couponProducts.product)
    couponProducts: CouponProduct;

    @OneToOne(type => SubOrder, s => s.product)
    @JoinColumn({ name: 'id' })
    public suborder: SubOrder;

    @OneToMany((type) => ProductVariants, variant => variant.product)
    @JoinColumn({ name: 'id' })
    public productVariants: ProductVariants[];

    @OneToMany(() => SameDayProductPincodes, (sameDayProductPincodes) => sameDayProductPincodes.productId)
    public sameDayProductPincodes: SameDayProductPincodes[];

    @OneToMany(() => OpenBoxProductPincodes, (openBoxProductPincodes) => openBoxProductPincodes.productId)
    public openBoxProductPincodes: OpenBoxProductPincodes[];

    @OneToOne(type => SectionProducts, s => s.product)
    @JoinColumn({ name: 'id' })
    public sectionProducts: SectionProducts;
}
