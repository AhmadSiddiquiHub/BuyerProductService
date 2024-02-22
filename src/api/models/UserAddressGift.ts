import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
@Entity('user_addresses_gift')
export class UserAddressGift {

    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'first_name' })
    public firstName: string;

    @Column({ name: 'last_name' })
    public lastName: string;

    @Column({ name: 'email' })
    public email: string;

    @Column({ name: 'phone' })
    public phone: string;

    @IsNotEmpty()
    @Column({ name: 'state_id' })
    public stateId: number;

    @IsNotEmpty()
    @Column({ name: 'city_id' })
    public cityId: number;

    @IsNotEmpty()
    @Column({ name: 'address' })
    public address: string;

    @IsNotEmpty()
    @Column({ name: 'nearby' })
    public nearby: string;

    @Column({ name: 'postcode' })
    public postcode: number;

    @IsNotEmpty()
    @Column({ name: 'type' })
    public type: string;
}
