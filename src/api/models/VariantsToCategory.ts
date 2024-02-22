import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('variants_to_category')
export class VariantsToCategory {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'category_id' })
    public categoryId: number;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: 'variant_id' })
    public variantId: number;

    @Column({ name: 'show_on_catalog_filters' })
    public showOnCatalogFilters: number;

    @Column({ name: 'show_on_create_product_form' })
    public showOnCreateProductForm: number;
}