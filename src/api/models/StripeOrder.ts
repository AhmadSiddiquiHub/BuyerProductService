import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import moment = require('moment');
import { AppLevelDateTimeFormat } from '../../api/utils';
@Entity('stripe_order')
export class StripeOrder {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'order_id' })
    public orderId: number;

    @Column({ name: 'session_id' })
    public stripeSessionId: string;

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
