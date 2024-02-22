import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import moment = require('moment');
import { AppLevelDateTimeFormat } from '../utils';

@Entity('site_users')
export class SiteUser {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @IsNotEmpty()
    @Column({ name: 'is_active' })
    public isActive: number;

    @IsNotEmpty()
    @Column({ name: 'created_at' })
    public createdAt: string;

    @Column({ name: 'update_at' })
    public updateAt: string;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updateAt = moment().format(AppLevelDateTimeFormat);
    }
}
