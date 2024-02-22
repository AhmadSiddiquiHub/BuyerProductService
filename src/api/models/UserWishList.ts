import { IsNotEmpty } from 'class-validator';
import {  Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { AppLevelDateTimeFormat } from '../utils';
import moment = require('moment');
@Entity('user_wishlist')
export class UserWishlist {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public wishlistProductId: number;

    @IsNotEmpty()
    @Column({ name: 'user_id' })
    public userId: number;

    @IsNotEmpty()
    @Column({ name: 'product_id' })
    public productId: number;

    @IsNotEmpty()
    @Column({ name: 'site_id' })
    public siteId: number;

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
