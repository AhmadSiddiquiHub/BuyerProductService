import moment = require('moment/moment');
import { AppLevelDateTimeFormat } from '../utils';
import { Column, Entity, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';

@Entity('campaign_products')
export class CampaignProducts {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;
    @Column({ name: 'campaign_id' })
    public campaignId: number;

    @Column({ name: 'product_id' })
    public productId: number;

    @Column({ name: 'vendor_id' })
    public vendorId: number;

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
