import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
@Entity('SiteFaqs')
export class SiteFaqs {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'interface_id ' })
    public interfaceId: number;
}
