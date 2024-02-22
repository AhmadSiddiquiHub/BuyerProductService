import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('Roles')
export class Roles {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'description' })
    public description: string;

    @IsNotEmpty()
    @Column({ name: 'is_active' })
    public isActive: number;
}
