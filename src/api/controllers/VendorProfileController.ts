import 'reflect-metadata';
import { JsonController, Res, Req, Post, Body } from 'routing-controllers';
import { ProductRatingsService } from '../services/ProductRatingsService';
import { VendorProfileReviewsListing, VendorProfile } from './requests';
import { VendorStoreProfileService } from '../services/VendorStoreProfileService'

@JsonController('/vendor')
export class VendorProfileController {
    constructor(
        private productRatingsService: ProductRatingsService,
        private vendorStoreProfileService: VendorStoreProfileService,
    ) {}

    // /api/buyer/products/vendor/vendor-profile
    @Post('/vendor-profile')
    public async vendorProfileStore(@Body({ validate: true }) params: VendorProfile, @Req() request: any, @Res() response: any): Promise<any> {
        // const store = await this.vendorStoreProfileService.findOne({ where: { slug: params.vendor } });
        // const voucherlist = await this.couponUsersService.voucherlist(request.user.userId,today);
        const store = await this.vendorStoreProfileService.vendorProfile(params.vendor);
        store.positive_feedback = parseFloat(store.positive_feedback).toFixed(1).toString();
        const productsCount = await this.vendorStoreProfileService.vendorActiveProducts(params.vendor);
        // productsCount
        // below query is not satisfying. error is coming that is why i am commenting
        // const voucherlist = await this.couponService.couponListing(store.userId);
        const voucherlist = [];
        if (!store) {
            return response.status(404).send({ status: 0, message: '', data: {} });
        }
        store.banner = [];
        let images = [];
        if (store.banner) {
            try {
                const b = JSON.parse(store.banner);
                if (Array.isArray(b)) {
                    images = b;
                    images = b.map((item, index) => {
                        return {
                            image: item,
                            isDefault: 0,
                        };
                    })
                }
            } catch (error) {}
        }
        const p = {
            ...store,
            productsCount: productsCount.productsCount,
            images,
            voucherlist
        };
        const successResponse: any = { status: 1, message: 'profile', data: p };
        return response.status(200).send(successResponse);
    }

    // /api/buyer/products/vendor/vendor-profile-reviews
    @Post('/vendor-profile-reviews')
    public async vendorProfileReviews(@Body({ validate: true }) params: VendorProfileReviewsListing, @Req() request: any, @Res() response: any): Promise<any> {
        const store = await this.vendorStoreProfileService.vendorProfile(params.vendor);
        if (!store) {
            return response.status(400).send({ status: 0, message: '', data: {} });
        }
        const vendorRatingStars = this.vendorStoreProfileService.vendorProfileRatignCalculations(store);
        const limit = params.limit;
        const offset = params.offset;
        const vendorId: any = store.vendorId;
        const siteId = request.siteId;
        const reviews = await this.productRatingsService.prodcutRatingListing({ limit, offset, vendorId, siteId, count: false });
        const totalReviewCount = await this.productRatingsService.prodcutRatingListing({ limit: 0, offset: 0, vendorId, siteId, count: true });
        let total = totalReviewCount / limit;
        total = Math.ceil(total);
        const successResponse: any = {
            status: 1,
            message: 'listing',
            pages: total,
            data: {
                avgRating: vendorRatingStars.avgRating,
                totalReviewCount,
                stars: vendorRatingStars.stars,
                reviewsList: reviews,
            }
        };
        return response.status(200).send(successResponse);
    }
}
