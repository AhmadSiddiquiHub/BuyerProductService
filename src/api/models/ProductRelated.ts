import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import moment = require('moment');
import { AppLevelDateTimeFormat } from '../utils';
@Entity('product_related')
export class ProductRelated {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'product_id' })
    public productId: number;

    @IsNotEmpty()
    @Column({ name: 'related_product_id' })
    public relatedProductId: number;

    @IsNotEmpty()
    @Column({ name: 'created_at' })
    public createdAt: string;

    @IsNotEmpty()
    @Column({ name: 'updated_at' })
    public updatedAt: string;

    @IsNotEmpty()
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
