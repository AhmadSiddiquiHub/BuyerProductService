import {  Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('shipping_regions')
export class ShippingRegion {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'parent' })
    public parent: number;

    @IsNotEmpty()
    @Column({ name: 'region_type' })
    public regionType: string;

    @IsNotEmpty()
    @Column({ name: 'min_zipcode' })
    public minZipCode: number;

    @IsNotEmpty()
    @Column({ name: 'min_zipcode' })
    public maxZipCode: number;

    
}
