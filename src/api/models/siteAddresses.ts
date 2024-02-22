import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
@Entity('siteAddresses')
export class SiteAddresses {

    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'city_id ' })
    public cityId: number;

    @Column({ name: 'line_addr_1' })
    public lineAddr1: string;

    @Column({ name: 'line_addr_2' })
    public lineAddr2: string;

    @IsNotEmpty()
    @Column({ name: 'is_active' })
    public isActive: number;
}
