import { Column, Entity, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import moment = require('moment/moment');
import { IsNotEmpty } from 'class-validator';
import { AppLevelDateTimeFormat } from '../utils';
import { Users } from './Users';
@Entity('campaign_vendors')
export class CampaignVendors {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;
    @IsNotEmpty()
    @Column({ name: 'campaign_id' })
    public campaignId: number;

    @Column({ name: 'vendor_id' })
    public vendorId: number;
    
    @Column({ name: 'site_id' })
    public siteId: number;

    @ManyToOne(type => Users, users => users.campaignVendors)
    @JoinColumn({ name: 'vendor_id' })
    public vendors: Users[];

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
