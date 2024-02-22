import { Column, Entity, JoinColumn, OneToOne,  PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Users } from './Users';
import { SubOrder } from './SubOrder';
import moment from 'moment';
import { AppLevelDateTimeFormat } from '../utils';
@Entity('product_ratings')
export class ProductRating {
    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'product_id' })
    public productId: number;

    // @IsNotEmpty()
    // @Column({ name: 'site_id' }) // deleted form db
    // public siteId: number;

    @IsNotEmpty()
    @Column({ name: 'vendor_id' }) // added to db again
    public vendorId: number;

    @IsNotEmpty()
    @Column({ name: 'product_variant_id' })
    public productVariantId: number;
    
    @IsNotEmpty()
    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'sub_order_id' })
    public subOrderId: number;

    @IsNotEmpty()
    @Column({ name: 'rating' })
    public rating: number;

    @IsNotEmpty()
    @Column({ name: 'review' })
    public review: string;

    @IsNotEmpty()
    @Column({ name: 'is_active' })
    public isActive: number;

    @IsNotEmpty()
    @Column({ name: 'is_approved' })
    public isApproved: number;

    @IsNotEmpty()
    @Column({ name: 'created_at' })
    public createdAt: string;

    @IsNotEmpty()
    @Column({ name: 'updated_at' })
    public updatedAt: string;

    @Column({ name: 'fake_user_name' })
    public fakeUserName: string;

    @Column({ name: 'fake_user_pic' })
    public fakeUserPic: string;

    @OneToOne(type => Users, user => user.productRatingDetail)
    @JoinColumn({ name: 'user_id' })
    public userDetail: Users;

    @OneToOne(type => SubOrder, p => p.rating)
    @JoinColumn({ name: 'sub_order_id' })
    public suborder: SubOrder;

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updatedAt = moment().format(AppLevelDateTimeFormat);
    }

}
