import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('variants')
export class Variants {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'type' })
    public type: string;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'accept_images' })
    public acceptImages: number;
}
