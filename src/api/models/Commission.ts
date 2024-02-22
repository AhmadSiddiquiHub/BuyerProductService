import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
@Entity('commission')
export class Commission {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;
    @IsNotEmpty()
    @Column({ name: 'vendor_id' })
    public vendorId: number;
    @IsNotEmpty()
    @Column({ name: 'order_id' })
    public orderId: number;

    @Column({ name: 'commission' })
    public commission: number;
}
