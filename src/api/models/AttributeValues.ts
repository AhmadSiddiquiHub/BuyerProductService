import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('attribute_values')
export class AttributeValues {
    @PrimaryGeneratedColumn({ name: 'id' })
    public productAttrValuesId: number;

    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'product_attribute_id' })
    public productAttributeId: number;
    
    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'category_id' })
    public categoryId: number;
}
