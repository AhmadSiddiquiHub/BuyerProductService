import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToOne, OneToMany } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import moment = require('moment');
import { ProductRating } from './ProductRating';
import { AccessToken } from './AccessToken';
import * as bcrypt from 'bcrypt';
import { AppLevelDateTimeFormat } from '../utils';
import { SubOrder } from './SubOrder';
import { CampaignVendors } from './CampaignVendors';
import { Coupon } from './Coupon';
import { CouponUser } from './CouponUser';
@Entity('users')
export class Users {
    public static hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    }

    @IsNotEmpty()
    @PrimaryGeneratedColumn({ name: 'id' })
    public userId: number;

    // @Column({ name: 'site_id' })
    // public siteId: number;

    @IsNotEmpty()
    @Column({ name: 'type_id' })
    public typeId: string;

    @IsNotEmpty()
    @Column({ name: 'role_id' })
    public roleId: number;

    @IsNotEmpty()
    @Column({ name: 'first_name' })
    public firstName: string;

    @Column({ name: 'last_name' })
    public lastName: string;

    @Column({ name: 'Date_of_birth' })
    public dateOfBirth: string;

    @Column({ name: 'email' })
    public email: string;

    @IsNotEmpty()
    @Column({ name: 'password' })
    public password: string;

    @Column({ name: 'country_of_birth' })
    public countryOfBirth: number;
    @Column({ name: 'country_of_citizenship' })
    public countryOfCitizenship: number;

    @IsNotEmpty()
    @Column({ name: 'created_at' })
    public createdAt: string;

    @Column({ name: 'updated_at' })
    public updatedAt: string;


    @Column({ name: 'is_locked' })
    public isLocked: number;

    @Column({ name: 'locked_at' })
    public lockedAt: Date;

    @Column({ name: 'wallet_bal' })
    public walletBal: number;

    @Column({ name: 'save_brows_hist' })
    public saveBrowsHist: number;

    @IsNotEmpty()
    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: 'avatar' })
    public avatar: string;

    @Column({ name: 'path' })
    public path: string;

    @Column({ name: 'mobile_number' })
    public mobileNumber: string;

    @Column({ name: 'email_verified' })
    public emailVerified: number;

    @Column({ name: 'mobile_verified' })
    public mobileVerified: number;

    @Column({ name: 'socket_id'})
    public socketId: string;

    @Column({ name: 'vendor_profile_completed'})
    public vendorProfileCompleted: number;

    @Column({ name: 'login_type'})
    public lType: string;

    @OneToMany(type => Coupon, vendorCoupon => vendorCoupon.users)
    public vendorCoupon: Coupon[];

    @OneToMany(type => CouponUser, couponUsers => couponUsers.users) // new
    public couponUsers: CouponUser[];

    @OneToMany(type => CampaignVendors, campaignVendors => campaignVendors.vendors)
    public campaignVendors: CampaignVendors[];

    @OneToOne(type => ProductRating, profile => profile.userDetail)
    // @JoinColumn({ name: 'id' })
    public productRatingDetail: ProductRating;

    @OneToOne(type => SubOrder, so => so.vendorRelation)
     // @JoinColumn({ name: 'id' })
    public subOrderVendorRelation: SubOrder;

    @OneToOne(type => SubOrder, so => so.usersRelation)
    // @JoinColumn({ name: 'id' })
    public subOrderRelation: SubOrder;

    @OneToMany(type => AccessToken, accessToken => accessToken.user)
    public accessToken: AccessToken[];

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdAt = moment().format(AppLevelDateTimeFormat);
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.updatedAt = moment().format(AppLevelDateTimeFormat);
    }
}
