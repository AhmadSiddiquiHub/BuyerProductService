import { Column, Entity, PrimaryColumn, } from 'typeorm';
@Entity('site_settings')
export class SiteSettings {

    @PrimaryColumn({ name: 'site_id' })
    public siteId: number;

    @PrimaryColumn({ name: 'key_name' })
    public keyName: number;

    @Column({ name: 'value' })
    public value: string;

    @Column({ name: 'description' })
    public description: string;

    @Column({ name: 'setting_interface' })
    public settingInterface: string;
}
