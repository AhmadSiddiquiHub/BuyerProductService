import { Column, Entity, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('Invoices')
export class Invoices {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @PrimaryColumn({ name: 'name' })
    public name: string;

    @Column({ name: 'description' })
    public description: string;
}
