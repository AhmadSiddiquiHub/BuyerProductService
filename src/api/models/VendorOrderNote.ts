import { IsNotEmpty } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('vendor_order_notes')
export class VendorOrderNote {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;
    @IsNotEmpty()
    @Column({ name: 'order_id' })
    public orderId: number;
    @IsNotEmpty()
    @Column({ name: 'vendor_id' })
    public vendorId: number;
    @IsNotEmpty()
    @Column({ name: 'comments' })
    public comments: string;
}
