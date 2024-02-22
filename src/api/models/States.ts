import { Column, Entity, BeforeInsert, BeforeUpdate, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Countries } from './Countries';
import moment = require('moment/moment');
import { IsNotEmpty } from 'class-validator';
import { AppLevelDateTimeFormat } from '../utils';
@Entity('states')
export class States {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'name' })
    public name: string;

    @Exclude()
    @Column({ name: 'country_id' })
    public countryId: number;

    @Column({ name: 'country_code' })
    public countryCode: string;

    @Column({ name: 'fips_code' })
    public fipsCode: string;

    @Column({ name: 'iso2' })
    public iso2: string;

    @Column({ name: 'type' })
    public type: string;

    @Column({ name: 'created_at' })
    public createdAt: string;
    @Column({ name: 'updated_at' })
    public updatedAt: string;

    @Column({ name: 'flag' })
    public isActive: number;

    @Column({ name: 'latitude' })
    public latitude: number;

    @Column({ name: 'longitude' })
    public longitude: number;

    @Column({ name: 'wikiDataId' })
    public wikiDataId: string;

    @ManyToOne(type => Countries, countries => countries.states)
    @JoinColumn({ name: 'country_id' })
    public country: Countries;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }
    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updatedAt = moment().format(AppLevelDateTimeFormat);
    }
}
