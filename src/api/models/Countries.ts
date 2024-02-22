import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import moment from 'moment';
import { States } from './States';
import { AppLevelDateTimeFormat } from '../utils';
@Entity('countries')
export class Countries {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public countriesId: number;

    @IsNotEmpty()
    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'numeric_code' })
    public numericCode: string;

    @Column({ name: 'iso2' })
    public iso2: string;

    @Column({ name: 'iso3' })
    public iso3: string;

    @Column({ name: 'phonecode' })
    public phonecode: string;

    @Column({ name: 'capital' })
    public capital: string;

    @Column({ name: 'currency' })
    public currency: string;

    @Column({ name: 'currency_name' })
    public currencyName: string;

    @Column({ name: 'currency_symbol' })
    public currencySymbol: string;

    @Column({ name: 'tld' })
    public tld: string;

    @Column({ name: 'native' })
    public native: string;

    @Column({ name: 'region' })
    public region: string;

    @Column({ name: 'subregion' })
    public subRegion: string;

    @Column({ name: 'timezones' })
    public timezones: string;

    @Column({ name: 'translations' })
    public translations: string;

    @Column({ name: 'latitude' })
    public latitude: number;

    @Column({ name: 'longitude' })
    public longitude: number;

    @Column({ name: 'emoji' })
    public emoji: string;

    @Column({ name: 'emojiU' })
    public emojiU: string;

    @Column({ name: 'svg_icon' })
    public svgIcon: string;

    @Column({ name: 'created_at' })
    public createdAt: string;

    @Column({ name: 'updated_at' })
    public updatedAt: string;

    @IsNotEmpty()
    @Column({ name: 'flag' })
    public flag: number;

    @Column({ name: 'wikiDataId' })
    public wikiDataId: string;

    @OneToMany(type => States, states => states.country)
    public states: States[];

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updatedAt = moment().format(AppLevelDateTimeFormat);
    }
}
