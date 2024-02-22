import moment = require('moment');
import { AppLevelDateTimeFormat } from '../utils';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
@Entity('product_discounts')
export class ProductDiscount {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'vendor_product_variants_id' })
    public vendorProductVariantId: number;

    @Column({ name: 'price' })
    public price: number;

    @Column({ name: 'price_2' })
    public price2: string;
    
    @Column({ name: 'start_date' })
    public startDate: string;

    @Column({ name: 'end_date' })
    public endDate: string;

    @Column({ name: 'created_at' })
    public createdAt: string;

    @Column({ name: 'updated_at' })
    public updatedAt: string;

    @Column({ name: 'is_active' })
    public isActive: number;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updatedAt = moment().format(AppLevelDateTimeFormat);
    }
}
