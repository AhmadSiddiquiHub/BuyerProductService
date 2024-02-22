import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('product_attributes_vendor_values')
export class ProductAttributeVendorValue {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'category_id' })
    public categoryId: number;

    @Column({ name: 'product_id' })
    public productId: number;

    @Column({ name: 'product_attribute_id' })
    public productAttributeId: number;

    @Column({ name: 'product_attribute_value_id' })
    public productAttributeValueId: number;
}