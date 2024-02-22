import { Column, Entity, BeforeInsert, BeforeUpdate, PrimaryGeneratedColumn } from 'typeorm';
import moment = require('moment/moment');
import { IsNotEmpty } from 'class-validator';
import { AppLevelDateTimeFormat } from '../utils';
@Entity('customer_activity')
export class CustomerActivity {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'customer_activity_id' })
    public customerActivityId: number;
    @IsNotEmpty()
    @Column({ name: 'customer_id' })
    public customerId: number;

    @Column({ name: 'activity_id' })
    public activityId: number;

    @Column({ name: 'product_id' })
    public productId: number;

    @Column({ name: 'description' })
    public description: string;

    @Column({ name: 'created_date' })
    public createdDate: string;

    @Column({ name: 'modified_date' })
    public modifiedDate: string;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().format(AppLevelDateTimeFormat);
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().format(AppLevelDateTimeFormat);
    }
}
