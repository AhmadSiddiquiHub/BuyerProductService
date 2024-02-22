import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
@Entity('site_contact_info')
export class SiteContactInfo {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'phone_mobile' })
    public phoneNumber: string;

    @IsNotEmpty()
    @Column({ name: 'phone_ofc' })
    public phoneOfc: string;

    @Column({ name: 'phone_home' })
    public phoneHome: number;

    @Column({ name: 'email_ofc' })
    public emailOfc: string;

    @Column({ name: 'email_personal' })
    public emailPersonal: string;

    @IsNotEmpty()
    @Column({ name: 'is_active' })
    public isActive: number;
}
