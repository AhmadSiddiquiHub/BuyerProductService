import { IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Vendor } from './Vendor';



@Entity('same_day_global_pincodes')
export class SameDayGlobalPincodes {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @ManyToOne(() => Vendor, (vendor) => vendor.sameDayGlobalPincodes)
    @IsNotEmpty()
    @JoinColumn({ name: 'vendor_id' })
    public vendorId: number;

    @Column({ name: 'pincode' })
    @IsNotEmpty()
    public pincode: number;

}