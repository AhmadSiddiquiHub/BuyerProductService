import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('cities_tax_rates')
export class CitiesTaxRate {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'city_id' })
    public cityId: number;

    @Column({ name: 'rate' })
    public rate: string;
}
