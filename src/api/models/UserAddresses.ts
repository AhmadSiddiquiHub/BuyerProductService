import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import moment = require('moment');
import { AppLevelDateTimeFormat } from '../utils';
import { SubOrder } from './SubOrder';
@Entity('user_addresses')
export class UserAddresses {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'address_id' })
    public addressId: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'country_id' })
    public countryId: number;

    @Column({ name: 'state_id' })
    public stateId: number;

    @Column({ name: 'city_id' })
    public cityId: number;

    @Column({ name: 'user_type_id' })
    public userTypeId: string;

    @IsNotEmpty()
    @Column({ name: 'type' })
    public type: string;

    @IsNotEmpty()
    @Column({ name: 'line_addr_1' })
    public Lineaddr1: string;

    @IsNotEmpty()
    @Column({ name: 'line_addr_2' })
    public Lineaddr2: string;

    @IsNotEmpty()
    @Column({ name: 'line_addr_3' })
    public Lineaddr3: string;

    @Column({ name: 'zipcode' })
    public zipcode: number;

    @IsNotEmpty()
    @Column({ name: 'is_default' })
    public isDefault: number;

    @IsNotEmpty()
    @Column({ name: 'created_at' })
    public createdAt: string;

    @Column({ name: 'updated_at' })
    public updateAt: string;

    @IsNotEmpty()
    @Column({ name: 'is_active' })
    public isActive: number;

    // @OneToOne(type => SubOrder, s => s.vendorAddress)
    // @JoinColumn({ name: 'address_id' })
    // public address: SubOrder;

    @OneToOne(type => SubOrder, s => s.vendorAddress)
    @JoinColumn({ name: 'user_id' })
    public userAddress: SubOrder;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updateAt = moment().format(AppLevelDateTimeFormat);
    }
}
