import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tax_classes')
export class TaxClass {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;
    
    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'value' })
    public value: string;

    @Column({ name: 'is_active' })
    public isActive: number;

}
