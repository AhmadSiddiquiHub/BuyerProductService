import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import moment from 'moment';
import { AppLevelDateTimeFormat } from '../utils';
@Entity('product_tax')
export class ProductTax { 
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'identifier' })
    public identifier: string;

    @IsNotEmpty()
    @Column({ name: 'country_id' })
    public countryId: number;

    @IsNotEmpty()
    @Column({ name: 'state_id' })
    public stateId: number;

    @IsNotEmpty()
    @Column({ name: 'city_id' })
    public cityId: number;

    @IsNotEmpty()
    @Column({ name: 'product_id' })
    public productId: number;

    @IsNotEmpty()
    @Column({ name: 'min_zipcode' })
    public minZipCode: number;

    @IsNotEmpty()
    @Column({ name: 'max_zipcode' })
    public maxZipCode: number;

    @IsNotEmpty()
    @Column({ name: 'rate' })
    public rate: number;

    @IsNotEmpty()
    @Column({ name: 'created_at' })
    public createdAt: string;

    @IsNotEmpty()
    @Column({ name: 'updated_at' })
    public updatedAt: string;


    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updatedAt = moment().format(AppLevelDateTimeFormat);
    }

}
