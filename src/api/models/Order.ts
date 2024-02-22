import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import moment = require('moment');
import { SubOrder } from './SubOrder';
import { AppLevelDateTimeFormat } from '../utils';
@Entity('orders')
export class Order {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public orderId: number;

    @Column({ name: 'site_id' })
    public siteId: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'country_id' })
    public countryId: number;

    @Column({ name: 'state_id' })
    public stateId: number;

    @Column({ name: 'city_id' })
    public cityId: number;

    @Column({ name: 'area_id' })
    public areaId: number;

    @Column({ name: 'name' })
    public name: string;

    @Column({ name: 'line_addr_1' })
    public lineAddress1: string;

    @Column({ name: 'line_addr_2' })
    public lineAddress2: string;

    @Column({ name: 'line_addr_3' })
    public lineAddress3: string;

    @Column({ name: 'zipcode' })
    public zipcode: string;

    @Column({ name: 'addr_type' })
    public addrType: string;

    @Column({ name: 'status_id' })
    public statusId: number;

    @Column({ name: 'order_no' })
    public orderNo: string;

    @IsNotEmpty()
    @Column({ name: 'total_amount' })
    public totalAmount: number;

    @IsNotEmpty()
    @Column({ name: 'shipping_charges' })
    public shippingCharges: number;

    @IsNotEmpty()
    @Column({ name: 'payment_method_id' })
    public paymentMethodId: number;

    @IsNotEmpty()
    @Column({ name: 'payment_status' })
    public paymentStatus: number;

    @IsNotEmpty()
    @Column({ name: 'comments' })
    public comments: string;

    // @Column({ name: 'reward_points' })
    // public rewardPoints: number;

    // @Column({ name: 'commission' })
    // public commission: number;

    @Column({ name: 'coupon' })
    public coupon: string;

    @Column({ name: 'discount' })
    public discount: number;

    @Column({ name: 'created_at' })
    public createdAt: string;

    @Column({ name: 'updated_at' })
    public updatedAt: string;

    @Column({ name: 'invoice' })
    public invoice: string;

    @Column({ name: 'invoice_data' })
    public invoiceData: string;

    @Column({ name: 'tracking_slip' })
    public trackingSlip: string;

    @OneToOne(type => SubOrder, p => p.orderRelation)
    @JoinColumn({ name: 'id' })
    public suborderReation: SubOrder;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updatedAt = moment().format(AppLevelDateTimeFormat);
    }
}
