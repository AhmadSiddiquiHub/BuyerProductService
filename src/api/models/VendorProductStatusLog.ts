import { IsNotEmpty } from 'class-validator';
import moment from 'moment';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AppLevelDateTimeFormat } from '../utils';

@Entity('vendor_product_status_logs')
export class VendorProductStatusLog {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'product_id' })
    public productId: number;

    @IsNotEmpty()
    @Column({ name: 'vendor_id' })
    public vendorId: number;

    @Column({ name: 'updated_by' })
    public updatedBy: number;
    
    @IsNotEmpty()
    @Column({ name: 'product_status' })
    public productStatus: string;

    @Column({ name: 'comments' })
    public comments: string;

    @Column({ name: 'created_at' })
    public createdAt: string;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }
}
