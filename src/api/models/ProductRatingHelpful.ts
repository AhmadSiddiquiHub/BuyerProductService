import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import moment = require('moment');
import { AppLevelDateTimeFormat } from '../utils';
@Entity('product_rating_helpful')
export class ProductRatingHelpful {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'product_rating_id' })
    public productId: number;

    @IsNotEmpty()
    @Column({ name: 'created_at' })
    public createdAt: string;

    @IsNotEmpty()
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
