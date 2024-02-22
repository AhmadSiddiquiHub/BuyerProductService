import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reason_types')
export class ReasonType {
    @PrimaryGeneratedColumn({ name: 'type' })
    public type: string;

    @Column({ name: 'description' })
    public description: string;

    @Column({ name: 'is_active' })
    public isActive: number;
}
