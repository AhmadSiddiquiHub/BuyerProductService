import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Categories } from './Categories';
@Entity('site_categories')
export class SiteCategories {

    @PrimaryColumn({ name: 'site_id' })
    public siteId: string;

    @PrimaryColumn({ name: 'cat_id' })
    public catId: string;

    @Column({ name: 'show_in_menu' })
    public showInMenu: number;

    @Column({ name: 'featured' })
    public featured: number;

    @Column({ name: 'top_of_month' })
    public topOfMonth: number;

    @Column({ name: 'is_active' })
    public isActive: number;

    @OneToOne(type => Categories, category => category.siteCategory)
    @JoinColumn({ name: 'cat_id' })
    public category: Categories;
}
