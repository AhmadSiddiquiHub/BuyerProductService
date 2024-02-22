import { Column, Entity, JoinColumn, ManyToOne, OneToMany, /*JoinColumn,*/ OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { CategoriesML } from './CategoriesML';
import { CategoryBrand } from './CategoryBrand';
import Menus from './menus';
import SectionProducts from './SectionProducts';
import { SiteCategories } from './SiteCategories';
// import { SiteCategories } from './SiteCategories';
@Entity('categories')
export class Categories {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'parent' })
    public parentInt: number;

    @Column({ name: 'sort_order' })
    public sortOrder: string;

    @IsNotEmpty()
    @Column({ name: 'url_key' })
    public urlKey: string;

    @IsNotEmpty()
    @Column({ name: 'image' })
    public image: string;

    @IsNotEmpty()
    @Column({ name: 'icon' })
    public icon: string;

    @Column({ name: 'description' })
    public description: string;

    @Column({ name: 'size_chart_image_required'})
    public sizeChartImageRequired: number;

    // @IsNotEmpty()
    // @Column({ name: 'variant_ids' })
    // public variantIds: string;

    // @OneToOne(type => CategoriesML)
    // @JoinColumn({ name: 'cat_id' })
    // public categoriesMlDetail: CategoriesML;

    @OneToOne(type => CategoryBrand, categoryBrand => categoryBrand.category)
    public categoryBrand: CategoryBrand;

    @OneToOne(type => CategoriesML, categoriesML => categoriesML.category)
    public categoriesML: CategoriesML;
    // @IsNotEmpty()
    // @Column({ name: 'image_path' })
    // public imagePath: string;
    @OneToOne(() => Menus, menus => menus.category)
    menus: Menus;

    @JoinColumn({ name: "parent" })
    @ManyToOne(type => Categories, category => category.children)
    catParent: Categories;
  
    @OneToMany(type => Categories, category => category.catParent)
    children: Categories[];

    @OneToOne(type => SectionProducts, s => s.categories)
    public sectionProducts: SectionProducts;

    @OneToOne(type => SiteCategories, siteCategory => siteCategory.category)
    public siteCategory: SiteCategories;
  
}
