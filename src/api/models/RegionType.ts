import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import {IsNotEmpty} from 'class-validator';

Entity('region_type');
export class RegionType {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'type' })
    public regionType: string;
}
