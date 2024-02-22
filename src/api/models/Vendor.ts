import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { OpenBoxGlobalPincodes } from './OpenBoxGlobalPincodes';
import { SameDayGlobalPincodes } from './SameDayGlobalPincodes';
import { OpenBoxProductPincodes } from './OpenBoxProductPincodes';
import { SameDayProductPincodes } from './SameDayProductPincodes';

@Entity('vendors')
export class Vendor {

    @PrimaryColumn({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'is_profile_completed' })
    public isProfileCompleted: string;

    @Column({ name: 'status_id' })
    public statusId: string;

    @Column({ name: 'account_health' })
    public accountHealth: string;

    @Column({ name: 'rating_count_star1' })
    public OneStarRatingCount: number;

    @Column({ name: 'rating_count_star2' })
    public TwoStarRatingCount: number;

    @Column({ name: 'rating_count_star3' })
    public ThreeStarRatingCount: number;

    @Column({ name: 'avg_rating' })
    public avgRating: number;

    // @Column({ name: 'review_count' })
    // public reviewCount: number;

    @Column({ name: 'rating_count_star4' })
    public FourStarRatingCount: number;

    @Column({ name: 'rating_count_star5' })
    public FiveStarRatingCount: number;

    @Column({ name: 'courier_1', nullable: true, default: null })
    public courier1: string;

    @Column({ name: 'courier_2', nullable: true, default: null })
    public courier2: string;

    @Column({ name: 'courier_3', nullable: true, default: null })
    public courier3: string;

    @Column({ name: 'courier_4', nullable: true, default: null })
    public courier4: string;

    @Column({ name: 'same_day_active', default: 0 })
    public sameDayActive: number;

    @Column({ name: 'open_box_active', default: 0 })
    public openBoxActive: number;

    @OneToMany(() => OpenBoxGlobalPincodes, (openBoxGlobalPincodes) => openBoxGlobalPincodes.pincode)
    openBoxGlobalPincodes: number[];

    @OneToMany(() => SameDayGlobalPincodes, (sameDayGlobalPincodes) => sameDayGlobalPincodes.pincode)
    sameDayGlobalPincodes: number[];

    @OneToMany(() => SameDayProductPincodes, (sameDayProductPincodes) => sameDayProductPincodes.pincode)
    sameDayProdcutPincodes: number[];

    @OneToMany(() => OpenBoxProductPincodes, (openBoxProductPincodes) => openBoxProductPincodes.pincode)
    openBoxProductPincodes: number[];
}

// 							
