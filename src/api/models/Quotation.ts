import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import moment = require('moment');
import { AppLevelDateTimeFormat } from '../utils';

@Entity('quotations')
export class Quotation {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'product_id' })
    public productId: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'vendor_id' })
    public vendorId: number;

    @Column({ name: 'quantity' })
    public quantity: number;

    @Column({ name: 'discount' })
    public discount: number;

    @Column({ name: 'description' })
    public description: string;

    @Column({ name: 'seller_reply' })
    public sellerReply: string;

    @Column({ name: 'status' })
    public status: number;

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
