import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('cities')
export class Cities {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'state_id' })
    public stateId: number;

    @Column({ name: 'country_id' })
    public countryId: number;

}
