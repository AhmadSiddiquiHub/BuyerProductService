import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('order_statuses_ml')
export class OrderStatusesMl {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'order_status_id' })
    public orderStatusId: number;

    @Column({ name: 'lang_id' })
    public langId: number;
}