import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('variant_values')
export class VariantValues {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'variant_id' })
    public variantId: number;

    @Column({ name: 'value_name' })
    public valueName: string;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'is_active' })
    public isActive: number;
}
