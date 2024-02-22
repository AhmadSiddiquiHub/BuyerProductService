import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sms_vars')
export class SmsVariable {
    @PrimaryGeneratedColumn({ name: 'name' })
    public name: string;

    @Column({ name: 'value' })
    public value: string;

    @Column({ name: 'is_active' })
    public isActive: number;
}
