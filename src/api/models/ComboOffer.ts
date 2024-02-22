import moment = require('moment/moment');
import { AppLevelDateTimeFormat } from '../utils';
import { Column, Entity, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';

@Entity('combo_offers')
export class ComboOffer {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'vendor_id' })
    public vendorId: number;

    @Column({ name: 'combo_name' })
    public name: string;

    @Column({ name: 'combo_type' }) // 1-> percentage 2 -> amount
    public type: number;

    @Column({ name: 'combo_description' })
    public description: string;

    @Column({ name: 'discount' })
    public discount: number;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'product_ids' })
    public productIds: string;

    @Column({ name: 'created_at' })
    public createdAt: string;

    @Column({ name: 'updated_at' })
    public updatedAt: string;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }
    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updatedAt = moment().format(AppLevelDateTimeFormat);
    }
}
