import { IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Brands } from './Brands';
@Entity('site_brands')
export class SiteBrands {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'brand_id' })
    public brandId: number;
    
    @Column({ name: 'is_featured' })
    public isFeatured: number;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: 'brand_page_banner_image' })
    public brandPageBannerImage: number;

    @OneToOne(type => Brands, o => o.id)
    @JoinColumn({ name: 'brand_id' })
    public brandsDetail: Brands;
}
