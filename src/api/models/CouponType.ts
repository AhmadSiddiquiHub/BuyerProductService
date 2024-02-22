import { Column, Entity, PrimaryColumn } from 'typeorm';


@Entity('coupon_types')
export class CouponType {

    @PrimaryColumn({ name: 'name' })
    public name: string;

    @Column({ name: 'description' })
    public description: number;


}
