import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('address_types')
export class AddressType {
    
    @PrimaryGeneratedColumn({ name: 'type' })
    public type: string;

    @Column({ name: 'name' })
    public name: string;
}
