import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToOne, JoinColumn } from 'typeorm';
import moment = require('moment');
import { AppLevelDateTimeFormat } from '../utils';
import { ProductMetaInfo } from './ProductMetaInfo';

@Entity('vendor_products')
export class VendorProduct {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'slug' })
    public slug: string;

    @Column({ name: 'vendor_id' })
    public vendorId: number;

    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'is_featured' })
    public isFeatured: number;

    @Column({ name: 'product_id' })
    public productId: number;

    @Column({ name: 'is_product_owner' })
    public isProductOwner: number;

    @Column({ name: 'created_at' })
    public createdAt: string;

    @Column({ name: 'updated_at' })
    public updatedAt: string;

	@Column({ name: 'hsn' })
    public hsn: number;

	@Column({ name: 'quantity' })
    public quantity: number;

    @Column({ name: 'brand_id' })
    public 	brandId: number;

    @Column({ name: 'search_keywords' })
    public 	searchKeywords: string;

    @Column({ name: 'COD' })
    public 	COD: number;

    @Column({ name: 'bulk_quote' })
    public 	bulkQuote: number;
    
    @Column({ name: 'status_id' })
    public 	statusId: number;

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

    @Column({ name: 'return_days' })
    public returnDays: number;

    @Column({ name: 'tax_class_id' })
    public taxClassId: number;
    
    @Column({ name: 'size_chart_image' })
    public sizeChartImage: string;

    @Column({ name: 'fake_orders' })
    public fakeOrders: number;

    @Column({ name: 'category_id' })
    public categoryId: number;

    @OneToOne(type => ProductMetaInfo)
    @JoinColumn({ name: "product_id", referencedColumnName: "productId" })
    public productMetaInfo: ProductMetaInfo;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updatedAt = moment().format(AppLevelDateTimeFormat);
    }

}
