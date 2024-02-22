import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('attributes_to_category')
export class AttributesToCategory {
    
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'category_id' })
    public categoryId: number;

    @Column({ name: 'product_attribute_id' })
    public productAttributeId: number;

    @Column({ name: 'sort_order' })
    public sortOrder: number;

    @Column({ name: 'type' })
    public type: string;

    @Column({ name: 'is_required' })
    public isRequired: number;

    @Column({ name: 'is_common' })
    public isCommon: number;

    @Column({ name: 'show_on_catalog_filters' })
    public showOnCatalogFilters: number;

    @Column({ name: 'show_on_create_product_form' })
    public showOnCreateProductForm: number;
}
