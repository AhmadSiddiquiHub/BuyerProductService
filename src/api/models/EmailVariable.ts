import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('email_vars')
export class EmailVariable {
    @PrimaryGeneratedColumn({ name: 'name' })
    public name: string;

    @Column({ name: 'value' })
    public value: string;

    @Column({ name: 'is_active' })
    public isActive: number;
}
