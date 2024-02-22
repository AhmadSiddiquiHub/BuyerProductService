import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import moment = require('moment');
import { AppLevelDateTimeFormat } from '../utils';
@Entity('sub_order_tracking')
export class SubOrderTracking {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'sub_order_id' })
    public subOrderId: number;

    @Column({ name: 'tracking_no' })
    public trackingNo: string;

    @Column({ name: 'courier_id' })
    public courierId: number;

    @Column({ name: 'comments' })
    public comments: string;

    @Column({ name: 'created_at' })
    public createdAt: string;

    @Column({ name: 'updated_at' })
    public updatedAt: string;

    @Column({ name: 'shipped_on' })
    public shippedOn: string;

    @Column({ name: 'shipped_by' })
    public shippedBy: number;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updatedAt = moment().format(AppLevelDateTimeFormat);
    }
}
