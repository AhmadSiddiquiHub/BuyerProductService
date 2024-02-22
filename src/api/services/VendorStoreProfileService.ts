import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { VendorStoreProfileRepository } from '../repositories/VendorStoreProfileRepository';
import { VendorStoreProfile } from '../models/VendorStoreProfile';
import { SubOrder } from '../models/SubOrder';
import { getConnection } from 'typeorm';
import { Vendor } from '../models/Vendor';
import { sum } from 'lodash';
import { Users } from '../models/Users';
import { VendorProduct } from '../models/VendorProduct';

@Service()
export class VendorStoreProfileService {

    constructor(@OrmRepository() private repo: VendorStoreProfileRepository) {
    }

    public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }
    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }
    public async vendorActiveProducts(slug: any): Promise<any> {
        const selects = [
            'COUNT(VendorProduct.productId) as productsCount'
        ];
        const query: any = await getConnection().getRepository(Users).createQueryBuilder('Users')
        .innerJoin(Vendor, 'Vendor', 'Vendor.userId = Users.userId')
        .innerJoin(VendorStoreProfile, 'VendorStoreProfile', 'VendorStoreProfile.userId = Users.userId')
        .leftJoin(VendorProduct, 'VendorProduct', 'VendorProduct.vendorId = Users.userId AND VendorProduct.statusId = 1')
        .select(selects)
        .where('VendorStoreProfile.slug = :slug', { slug });
        return query.getRawOne();
    }
    public async vendorProfile(slug: string): Promise<any> {
        const selects = [
            'VendorStoreProfile.userId as vendorId',
            'VendorStoreProfile.backgroundImage as backgroundBannerImage',
            'VendorStoreProfile.storeName as name',
            'VendorStoreProfile.profileImage as profileImage',
            'VendorStoreProfile.slug as slug',
            'VendorStoreProfile.banner as banner',
            'Vendor.avgRating as avgRating',
            'Vendor.avgRating as positive_feedback',
            'Vendor.OneStarRatingCount as OneStarRatingCount',
            'Vendor.TwoStarRatingCount as TwoStarRatingCount',
            'Vendor.ThreeStarRatingCount as ThreeStarRatingCount',
            'Vendor.FourStarRatingCount as FourStarRatingCount',
            'Vendor.FiveStarRatingCount as FiveStarRatingCount',
            'COUNT(SO.productId) as sales'
        ];
        const query: any = await getConnection().getRepository(VendorStoreProfile).createQueryBuilder('VendorStoreProfile')
        .innerJoin(Vendor, 'Vendor', 'Vendor.userId = VendorStoreProfile.userId')
        .innerJoin(Users, 'Users', 'Vendor.userId = Users.userId')
        .leftJoin(SubOrder, 'SO', 'SO.vendorId = VendorStoreProfile.userId AND SO.statusId IN (5,8,10)')
        .select(selects)
        .where('VendorStoreProfile.slug = :slug', { slug });
        return query.getRawOne();
    }
    public vendorProfileRatignCalculations(vendor: any) {
        const a = vendor.OneStarRatingCount;
        const b = vendor.TwoStarRatingCount;
        const c = vendor.ThreeStarRatingCount;
        const d = vendor.FourStarRatingCount;
        const e = vendor.FiveStarRatingCount;
        const x = [a, b, c, d, e];
        const reviewCount = sum(x);
        const stars = x.map((item, index) => {
            const check = Math.ceil((item / reviewCount) * 100);
            if (!check) {
                return 0;
            }
            return check;
        });
        const q = a * 1;
        const w = b * 2;
        const r = c * 3;
        const t = d * 4;
        const y = e * 5;
        let avgRating: any = (q + w + r + t +y) / reviewCount;
        if (avgRating) {
            avgRating = parseFloat(avgRating).toFixed(1);
        } else {
            avgRating = '0'
        }
        return {
            stars,
            avgRating
        }
    }

}
