import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
@Entity('contact')
export class Contact {

    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'name' })
    public name: string;

    @IsNotEmpty()
    @Column({ name: 'email' })
    public email: string;

    @Column({ name: 'phone' })
    public phone: string;

    @Column({ name: 'message' })
    public message: string;
}
