import { Column, Entity, 
    // JoinColumn,
    //  OneToOne, 
     PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('brands_meta_info')
export class BrandsMetaInfo {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'brand_id' })
    public brandId: number;

    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'meta_title' })
    public metaTitle: string;
    
    @Column({ name: 'meta_keyword' })
    public metaKeyword: string;
    
    @Column({ name: 'meta_description' })
    public metaDescription: string;
}


