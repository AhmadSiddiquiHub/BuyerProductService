import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Menus from './menus';
@Entity('campaign')
export class Campaign {
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'campaign_name' })
    public campaignName: string;

    @Column({ name: 'start_date' })
    public startDate: string;

    @Column({ name: 'end_date' })
    public endDate: string;

    @Column({ name: 'status' })
    public status: string;

    @Column({ name: 'slug' })
    public slug: string;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: 'main_page_banner' })
    public mainPageBanner: string;

    @Column({ name: 'vendor_reg_banner' })
    public vendorRegBanner: string;

    @Column({ name: 'meta_title' })
    public metaTitle: string;

    @Column({ name: 'meta_keyword' })
    public metaKeyword: string;

    @Column({ name: 'meta_description' })
    public metaDescription: string;

    @OneToOne(() => Menus, menus => menus.campaign)
    menus: Menus;
}
