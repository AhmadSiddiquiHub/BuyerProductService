import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
@Entity('site_banners')
export class SiteBanners {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'type' })
    public type: string;

    @IsNotEmpty()
    @Column({ name: 'destination_type' })
    public destinationType: string;

    @Column({ name: 'url' })
    public url: string;

    @IsNotEmpty()
    @Column({ name: 'image' })
    public image: string;

    @Column({ name: 'is_active' })
    public isActive: number;
}
