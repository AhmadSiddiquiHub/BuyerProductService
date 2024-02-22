import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('warranty_types')
export class WarrantyTypes {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'type' })
    public type: string;

    @Column({ name: 'active' })
    public active: number;
}
