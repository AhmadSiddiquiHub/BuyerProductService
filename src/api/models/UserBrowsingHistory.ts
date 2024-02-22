import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';
import moment = require('moment');
import { AppLevelDateTimeFormat } from '../utils';
import { IsNotEmpty } from 'class-validator';
@Entity('user_browsing_history')
export class UserBrowsingHistory {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'product_id' })
    public productId: number;

    @Column({ name: 'created_at' })
    public createdAt: string;

    @Column({ name: 'updated_at' })
    public updatedAt: string;

    @Column({ name: 'deleted' })
    public deleted: number;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }
    @BeforeInsert()
    public async updateDetails(): Promise<void> {
        this.updatedAt = moment().format(AppLevelDateTimeFormat);
    }
}
