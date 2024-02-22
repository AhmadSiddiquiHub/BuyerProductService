import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import moment = require('moment');
import { AppLevelDateTimeFormat } from '../utils';
import { text } from 'aws-sdk/clients/customerprofiles';
@Entity('vendor_store_profiles')
export class VendorStoreProfile {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'store_name' })
    public storeName: string;

    @Column({ name: 'slug' })
    public slug: string;

    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'profile_image' })
    public profileImage: string;

    @Column({ name: 'background_image' })
    public backgroundImage: string;

    @Column({ name: 'banner' })
    public banner: text;

    @IsNotEmpty()
    @Column({ name: 'created_at' })
    public createdAt: string;

    @Column({ name: 'updated_at' })
    public updateAt: string;

    @Column({ name: 'is_top_rated' })
    public isTopRated: number;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updateAt = moment().format(AppLevelDateTimeFormat);
    }
}
