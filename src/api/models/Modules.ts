import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('Modules')
export class Modules {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'parent' })
    public parent: number;

    @IsNotEmpty()
    @Column({ name: 'is_active' })
    public isActive: number;
}
