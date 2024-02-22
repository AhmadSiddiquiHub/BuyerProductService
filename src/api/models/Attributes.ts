import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('attributes')
export class Attributes {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public productAttributesId: number;

    @Column({ name: 'label' })
    public label: string;

    @Column({ name: 'form_name' })
    public formName: string;

    @Column({ name: 'attribute_type' })
    public attributeType: string;
}
