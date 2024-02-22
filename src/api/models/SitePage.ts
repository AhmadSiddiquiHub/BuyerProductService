import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';

@Entity('site_pages')
export class SitePage {
    @IsNotEmpty()
    @PrimaryColumn({ name: 'url_key' })
    public urlKey: string;

    @IsNotEmpty()
    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'description ' })
    public description: string;
}
