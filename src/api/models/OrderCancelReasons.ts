import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('order_cancel_reasons')
export class OrderCancelReasons {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'reason' })
    public reason: string;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: 'user_type_id' })
    public userTypeId: string;
}
