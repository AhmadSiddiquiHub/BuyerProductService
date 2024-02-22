import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Categories } from './Categories';
import { Brands } from './Brands';
@Entity('category_brand')
export class CategoryBrand {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({name: 'cat_id'})
    public catId: number;

    @IsNotEmpty()
    @Column({ name: 'brand_id' })
    public brandId: number;

    @IsNotEmpty()
    @Column({ name: 'site_id' })
    public siteId: number;

    @IsNotEmpty()
    @Column({ name: 'sort_order' })
    public sortOrder: string;

    @IsNotEmpty()
    @Column({ name: 'is_active' })
    public isActive: number;

    @OneToOne(type => Categories, categories => categories.id)
    @JoinColumn({ name: 'cat_id' })
    public category: Categories;

    @OneToOne(type => Brands, brands => brands.categorybrand)
    public brands: Brands;
}
