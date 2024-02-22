import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { OrderPreference } from './OrderPreference';

@Entity('vendor_order_preferences')
export class VendorOrderPreference {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'order_preference_id' })
    public orderPreferenceId: number;

    @Column({ name: 'vendor_id' })
    public vendorId: number;

    @OneToOne(type => OrderPreference, p => p.vendorOrderPreferenceRelation)
    @JoinColumn({ name: 'order_preference_id' })
    public orderPreferenceRelation: OrderPreference;
}
