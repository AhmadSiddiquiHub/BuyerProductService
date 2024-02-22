import { Entity, PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('Interfaces')
export class Interfaces {
    @IsNotEmpty()
    @PrimaryColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @PrimaryColumn({ name: 'name' })
    public name: string;
}
