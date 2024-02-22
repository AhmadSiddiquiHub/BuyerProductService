import { Column, Entity, OneToOne, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import moment = require('moment');
import { AppLevelDateTimeFormat } from '../utils';
import { SubOrder } from './SubOrder';

@Entity('vendor_product_variants')
export class VendorProductVariants {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'vendor_id' })
    public vendorId: number;

    @IsNotEmpty()
    @Column({ name: 'site_id' })
    public siteId: number;

    @IsNotEmpty()
    @Column({ name: 'product_id' })
    public productId: number;

    @IsNotEmpty()
    @Column({ name: 'product_variant_id' })
    public productVariantId: number;

	@Column({ name: 'price' })
    public price: number;

    @Column({ name: 'price_2' })
    public price2: string;

    @Column({ name: 'is_active' })
    public 	isActive: number;

    @Column({ name: 'available' })
    public 	available: number;

    @Column({ name: 'out_of_stock' })
    public outOfStock: number; 

    @Column({ name: 'quantity' })
    public 	quantity: number;

    @Column({ name: 'is_featured' })
    public 	isFeatured: number;

    @Column({ name: 'created_at' })
    public createdAt: string;

    @Column({ name: 'vendor_status' })
    public vendorStatus: string;

    @Column({ name: 'product_status' })
    public productStatus: number;

    @Column({ name: 'brand_id' })
    public brandId: number;

    @Column({ name: 'tax_class_id' })
    public taxClassId: number;

    @Column({ name: 'product_slug' })
    public productSlug: string;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }

    @OneToOne(type => SubOrder, so => so.vpvrelation)
    // @JoinColumn({ name: 'id' })
    public subOrderRelation: SubOrder;
}
