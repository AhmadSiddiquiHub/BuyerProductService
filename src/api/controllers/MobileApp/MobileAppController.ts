import 'reflect-metadata';
import { JsonController, Res, Req, Post } from 'routing-controllers';
import { ProductService } from '../../services/ProductService';
import { FunctionService } from '../../services/FunctionService';
import { HomeService } from '../../services/HomeService';
import { ProductVariantValueService } from '../../services/ProductVariantValueService';
import { ProductVariantsService } from '../../services/ProductVariantsService';
import { ProductVariantImagesService } from '../../services/ProductVariantImagesService';
import { UserWishlistService } from '../../services/UserWishlistService';
import { CartService } from '../../services/CartService';
import { orderBy } from 'lodash';
import { SiteSettingsService } from '../../services/SiteSettingsService';
import { SiteCategoriesService } from '../../services/SiteCategoriesService';
// import { RedisService } from '../../services/RedisService';
// import {createClient} from 'redis'
// const client = createClient();
// client.connect()
// const EXPIRETION_TIME = 3600;
// if(client){
//     console.log('Connected with redis')
// }

@JsonController('/mobile-app')
export class MobileAppController {
    constructor(
        private productService: ProductService,
        private homeService: HomeService,
        private cartService: CartService,
        private functionService: FunctionService,
        private productVariantValueService: ProductVariantValueService,
        private productVariantsService: ProductVariantsService,
        private productVariantImagesService: ProductVariantImagesService,
        private userWishlistService: UserWishlistService,
        private siteSettingsService: SiteSettingsService,
        private siteCategoriesService: SiteCategoriesService,
        
        
    ) {}

    // /api/buyer/products/mobile-app/home-1
    @Post('/home-1')
    public async homeFirstCall(@Req() request: any, @Res() response: any): Promise<any> {
        const siteId = request.siteId;
        const langId = 1;
        // get banners for the home screen
        const sliderBanners = await this.homeService.banners(request.siteId, 'HMS');
        const sideBanners = await this.homeService.banners(request.siteId, 'HTR');
        const bottomBanners = await this.homeService.banners(request.siteId, 'HBS');
        // const homepageMiddleSection = await this.homeService.homepageMiddleSectionBanners(siteId);
        const banners = [
            // ...homepageMiddleSection.sectionA,
            // ...homepageMiddleSection.sectionB,
            ...sliderBanners,
            ...sideBanners
        ];
        const topCategories = await this.homeService.topCategoriesofMonth(siteId, langId);
        const popularBrands = await this.homeService.popularBrands(request);
        const topRatedStores = await this.homeService.topRatedStores();
        const tabNames = [
            { title: 'All' },
            { title: 'Today Deals' },
            { title: 'Featured' },
            { title: 'Top Rated' }
        ];
        const data: any = {
            mainSliderBanners: banners,
            bottomSliderBanners: bottomBanners,
            topCategories,
            popularBrands,
            topRatedStores,
            tabNames,
            cartCount: 0,
            wishListCount: 0,
            todayDeals: []
        };
        const isUserLoggedIn = await this.functionService.isUserLoggedIn(request);
        if (isUserLoggedIn) {
            const userId = isUserLoggedIn;
            const cartItems = await this.cartService.find({ where: { userId }});
            const wishListItems = await this.userWishlistService.find({ where: { userId, siteId }});
            data.cartCount = cartItems.length;
            data.wishListCount = wishListItems.length;
        }
        const sitesettings = await this.siteSettingsService.findOne({ where: { keyName: "homePageSectionsLimits" }});
        const hpLimits = sitesettings && sitesettings.value.includes("_") ? sitesettings.value.split("_") : ['TD','10','FP','10','TR','10','TrnD','10'] ; //1,3,5,7
        const a =Object.assign({},hpLimits);
        request.body.limit = a["1"];//"TD"
        request.body.ptype = 'TDP';
        const productList: any = await this.productService.listing(request);
        const results = await this.productService.productListing_ResponseStructure(productList, request);
        data.todayDeals = results;
        return response.status(200).send({ status: 1, message: 'success', data });
    }

    // /api/buyer/products/mobile-app/home-1
    @Post('/home-2')
    public async homeFirstCallV2(@Req() request: any, @Res() response: any): Promise<any> {
        const data = await this.homeFirstAPiCall(request, response);
        return response.status(200).send({ status: 1, message: 'success', data });
    }
    // /api/buyer/products/mobile-app/subCats
    @Post('/subCats')
    public async getSubCats(@Req() request: any, @Res() response: any): Promise<any> {
        const siteId = request.siteId;
        const langId = 1;
        const cats = await this.siteCategoriesService.getSubCatsofThisCat(request.body.catId, siteId, langId);
        const categories = cats.filter(i=>i.parent == 0).map((item, index) => {
            return {
                title: item.name,
                image: item.image,
                type: '',
                navigate_to: 'catalog_screen',
                slug: item.slug,
            };
        });
        return response.status(200).send({ status: 1, message: 'success', data: categories });
    }

    public async homeFirstAPiCall(request: any, response: any): Promise<any> {
        const sitesettings = await this.siteSettingsService.findOne({ where: { keyName: "homePageSectionsLimits" }});
        const hpLimits = sitesettings && sitesettings.value.includes("_") ? sitesettings.value.split("_") : ['TD','10','FP','10','TR','10','TrnD','10'] ; //1,3,5,7
        const a =Object.assign({},hpLimits);
        request.body.limit = 10;
        request.body.offset = 0;
        const siteId = request.siteId;
        const langId = 1;
        console.log('---------------------------------------- request.siteId', request.siteId, langId);
        request.body.limit = a["1"];//"TD"
        request.body.ptype = 'TDP';
        const todayDeals: any = await this.productService.listing(request);
        request.body.limit = a["3"]; //FP
        request.body.ptype = 'FP';
        const featured: any = await this.productService.listing(request);
        request.body.limit = a["7"];//TrnD
        request.body.ptype = 'TSP';
        const topSellingProducts: any = await this.productService.listing(request);
        request.body.limit = a["5"];//TR
        request.body.ptype = 'TRP';
        const topRated: any = await this.productService.listing(request);
        const productList = [...todayDeals, ...featured, ...topSellingProducts, ...topRated];
        const results = await this.productService.productListing_ResponseStructure(productList, request);
        // request.body.limit = a["1"];//"TD"
        // const todayDeals = await this.todayDealsProducts(request);
        // request.body.limit = a["3"]; //FP
        // const featured = await this.featuredProducts(request);
        // request.body.limit = a["5"];//TR
        // const topRated = await this.topRatedProducts(request);
        // request.body.limit = a["7"];//TrnD
        // const trendingDeals = await this.homeService.trendingDealsProducts(request);
        // const topSellingProducts = await this.topSellingProducts(request);
        // const recentlyViewedProducts = [];
        // const banners2 = await this.homeService.featuredCategoryBanners();
        // get banners for the home screen
        const sliderBanners = await this.homeService.banners(request.siteId, 'HMS');
        const sideBanners = await this.homeService.banners(request.siteId, 'HTR');
        const banners = [
            ...sliderBanners,
            ...sideBanners
        ];
        const topCategories = await this.homeService.topCategoriesofMonth(siteId, langId);
        const popularBrands = await this.homeService.popularBrands(request);
        const topRatedStores = await this.homeService.topRatedStores();
        const tabNames = [
            { title: 'All' },
            { title: 'Today Deals' },
            { title: 'Featured' },
            { title: 'Top Rated' }
        ];
        const data: any = {
            mainSliderBanners: banners,
            topCategories,
            trendingDeals: [],
            popularBrands,
            topRatedStores,
            tabNames,
            todayDeals: results.filter(i => i.cronJobType == 'TDP'),
            featured: results.filter(i => i.cronJobType == 'FP'),
            topRated: results.filter(i => i.cronJobType == 'TRP'),
            topSellingProducts: results.filter(i => i.cronJobType == 'TSP'),
            cartCount: 0,
            wishListCount: 0,
            
            // recentlyViewedProducts,
            // banners2
        };
        const isUserLoggedIn = await this.functionService.isUserLoggedIn(request);
        if (isUserLoggedIn) {
            const userId = isUserLoggedIn;
            const cartItems = await this.cartService.find({ where: { userId }});
            const wishListItems = await this.userWishlistService.find({ where: { userId, siteId }});
            data.cartCount = cartItems.length;
            data.wishListCount = wishListItems.length;
        }
        return data;
    }

    public async todayDealsProducts(request) {
        request.body.ptype = 'TDP';
        const productList: any = await this.productService.listing(request);
        const a = await this.productService.productListing_ResponseStructure(productList, request);
        return a;
    }

    public async featuredProducts(request) {
        request.body.ptype = 'FP';
        const productList: any = await this.productService.listing(request);
        const a = await this.productService.productListing_ResponseStructure(productList, request);
        return a;
    }

    public async topSellingProducts(request) {
        request.body.ptype = 'TSP';
        const productList: any = await this.productService.listing(request);
        const a = await this.productService.productListing_ResponseStructure(productList, request);
        return a;
    }
    
    public async topRatedProducts(request) {
        request.body.ptype = 'TRP';
        const productList: any = await this.productService.listing(request);
        const a = await this.productService.productListing_ResponseStructure(productList, request);
        return a;
    }

    public async getVariantImages(variant: any): Promise<any> {
        const a = await this.productVariantImagesService.find({ where: { productVariantsId: variant.id }, order: { isDefault: 'DESC' }});
        const b = a.map((x, y) => {
            return { image: x.image, isDefault: x.isDefault };
        });
        return b;
    }

    public async variantsV2(productId: number, productvariantList: any): Promise<any> {
        const variantValue = productvariantList[0].variantValue;
        let productVariantValues = await this.productVariantValueService.variantValuesByProductId(productId);
        const uniqueVariants: any = [...new Map(productVariantValues.map(item => [item['variantId'], item])).values()];
        productVariantValues = uniqueVariants.map((x, y) => {
            const obj = {
                variantId: x.variantId,
                type: x.type,
                name: x.name,
                values: productVariantValues.filter((i, indx) => i.variantId === x.variantId).map((ii, iii) => {
                    return {
                        productVariantValueId: ii.productVariantValueId,
                        value: ii.value,
                        image: 'cybermart/Ven0061/Img_1671194559038.jpeg',
                        variantIndex: y,
                    };
                })
            };
            return obj;
        });
        const variantValueArray = variantValue.split(',');
        productVariantValues = productVariantValues.map((x, y) => {
            let values = x.values.map(v => {
                const check = variantValueArray.find(a => a == v.value);
                if (check) {
                    return { ...v, sort: 1 }
                }
                return { ...v, sort: 0 }
            });
            values = orderBy(values, ['sort'],['desc']);
            const obj = {
                ...x,
                values
            };
            return obj;
        });
        if (productVariantValues.length === 0) {
            const obj = [{
                variantId: 0,
                type: 'default',
                name: 'default',
                values: [
                    {
                        productVariantValueId: 0,
                        value: 'default',
                        image: '',
                        variantIndex: 0,
                    }
                ]
            }];
            productVariantValues = obj;
        }
        // manage images for variants
        productVariantValues = productVariantValues.map(item => {
            const values = item.values.map(value => {
                const imageObjectOfVariant = productvariantList.find(pv => {
                    if (pv.variantValue.includes(value.value)){
                        return pv;
                    }
                });
                if (imageObjectOfVariant) {
                    const abc = imageObjectOfVariant.images.find(image => image.isDefault === 1);
                    value.image = abc.image;
                } else {
                    value.image = 'cybermart/Ven0061/Img_1671194559038.jpeg';
                }
                return value;
            });
            return { ...item, values };
        });
        return productVariantValues;
    }

    public async variants(productId: any): Promise<any> {
        let productvariantList: any = await this.productVariantsService.find({ where: { productId }});
        productvariantList = productvariantList.map((v, i) => v.id);
        const images = await this.productVariantImagesService.findImagesByProductVariantIdsArray(productvariantList);
        const productVariantValues = await this.productVariantValueService.variantValuesByProductId(productId);
        const uniqueVariants: any = [...new Map(productVariantValues.map(item => [item['variantId'], item])).values()];
        console.log('uniqueVariants', uniqueVariants);
        console.log('images', images);
        let v = uniqueVariants.map((x, y) => {
            let image = images.find((image, i) => image.variantId === x.variantId && image.isDefault == 1);
            if (!image) {
                image = images.find((image, i) => image.variantId === x.variantId);
            }
            const obj = {
                variantId: x.variantId,
                type: x.type,
                name: x.name,
                values: productVariantValues.filter((i, indx) => i.variantId === x.variantId).map((ii, iii) => {
                    return {
                        productVariantValueId: ii.productVariantValueId,
                        value: ii.value,
                        image: image ? image.image: '',
                        variantIndex: y,
                    };
                })
            };
            return obj;
        });
        if (v.length === 0) {
            const obj = [{
                variantId: 0,
                type: 'default',
                name: 'default',
                values: [
                    {
                        productVariantValueId: 0,
                        value: 'default',
                        image: '',
                        variantIndex: 0,
                    }
                ]
            }];
            v = obj;
        }
        return v;
    }
}
