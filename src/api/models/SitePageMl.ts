import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('site_pages_ml')
export class SitePageMl {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'site_page_id' })
    public sitePageId: string;

    @IsNotEmpty()
    @Column({ name: 'site_id' })
    public siteId: number;

    @IsNotEmpty()
    @Column({ name: 'lang_id' })
    public langId: number;

    @Column({ name: 'meta_title' })
    public metaTitle: string;

    @Column({ name: 'meta_keyword' })
    public metaKeyword: string;

    @Column({ name: 'meta_description' })
    public metaDescription: string;
}
