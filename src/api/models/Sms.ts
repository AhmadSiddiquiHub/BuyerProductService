import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('sms')
export class Sms {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'description' })
    public description: string;
}
