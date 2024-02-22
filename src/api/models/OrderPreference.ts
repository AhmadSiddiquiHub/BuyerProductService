import { Column, Entity, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { VendorOrderPreference } from './VendorOrderPreference';

@Entity('order_preferences')
export class OrderPreference {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'col' })
    public col: string;

    @Column({ name: 'col_name' })
    public colName: string;

    @Column({ name: 'col_type' })
    public colType: string;

    @Column({ name: 'mandatory' })
    public mandatory: number;

    @OneToOne(type => VendorOrderPreference, s => s.orderPreferenceRelation)
    // @JoinColumn({ name: 'id' })
    public vendorOrderPreferenceRelation: VendorOrderPreference;
}
