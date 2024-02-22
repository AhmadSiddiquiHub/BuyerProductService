import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { getConnection, In } from 'typeorm';
// models
import { VendorProduct } from '../models/VendorProduct';
import { VendorProductVariants } from '../models/VendorProductVariants';
import { ProductVariants } from '../models/ProductVariants';
import { VendorProductCategory } from '../models/VendorProductCategory';
import { Product } from '../models/Product';
import { Vendor } from '../models/Vendor';
import { VendorStoreProfile } from '../models/VendorStoreProfile';
import { UserBrowsingHistory } from '../models/UserBrowsingHistory';
import { ProductAttributeVendorValue } from '../models/ProductAttributeVendorValue';
import { ProductVariantValue } from '../models/ProductVariantValue';
import { UserWishlist } from '../models/UserWishList';
import { Users } from '../models/Users';
import { CronJobProduct } from '../models/CronJobProduct';
import { CampaignProducts } from '../models/CampaignProducts';
import { Brands } from '../models/Brands';
import { ProductMetaInfo } from '../models/ProductMetaInfo';
// Services
import { ProductDiscountService } from './ProductDiscountService';
import { VendorProductVariantsService } from './VendorProductVariantsService';
import { ProductVariantImagesService } from './ProductVariantImagesService';
import { ProductVariantValueService } from './ProductVariantValueService';
import { ProductVariantsService } from './ProductVariantsService';
import { VendorStoreProfileService } from './VendorStoreProfileService';
import { ProductRepository } from '../repositories/ProductRepository';
import moment from 'moment';
import { Categories } from '../models/Categories';
import { SubOrder } from '../models/SubOrder';
import { formatPrice, SitesEnum, UserTypes, VendorStatusEnum } from '../utils';
import { ProductDiscount } from '../models/ProductDiscount';
import { ProductRatingsService } from './ProductRatingsService';
import { orderBy, sumBy } from 'lodash';
import { TaxClass } from '../models/TaxClass';
import { RelatedProductService } from './RelatedProductService';
import { RelatedProducts } from '../models/RelatedProducts';
import { ProductShippingInfo } from '../models/ProductShippingInfo';
import SectionProducts from '../models/SectionProducts';
import { AuthService } from '../../auth/AuthService';
import { Cart } from '../models/Cart';
import { WarrantyTypes } from '../models/WarrantyTypes';
import { ProductWarranty } from '../models/ProductWarranty';
import { ProductVariantImages } from '../models/ProductVariantImages';

interface ProductDiscountFunc {
    productId: number;
    siteId: number;
    vendorId: boolean;
    is_outOfStock?: boolean;
    vendorProductVariantId: number
}

interface ProductListingFuncInterface {
    limit: number,
    offset: number,
    ptype: string,
    vendorId: number,
    brandId: number,
    categoryId: number,
    campaignId: number,
    rating: number,
    brands: [number],
}

interface ProductDetailsFunc {
    slug: string,
    siteId: number,
    vendorId?: number,
    sellerView?: number
}

@Service()
export class ProductService {

    constructor(
        @OrmRepository() private repo: ProductRepository,
        private productDiscountService: ProductDiscountService,
        private vendorProductVariantsService: VendorProductVariantsService,
        private productVariantImagesService: ProductVariantImagesService,
        private productVariantValueService: ProductVariantValueService,
        private productVariantsService: ProductVariantsService,
        private vendorStoreProfileService: VendorStoreProfileService,
        private productRatingsService: ProductRatingsService, 
        private relatedProductService: RelatedProductService,
        private authService: AuthService,
    ) {}

    public async create(product: any): Promise<any> {
        return this.repo.save(product);
    }
    public async update(id: any, product: any): Promise<any> {
        product.id = id;
        return this.repo.save(product);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }

    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }

    public async getXML(limit: any, offset: any): Promise<any> {
        const results = await getConnection().getRepository(Product).createQueryBuilder('P')
        .select(['P.xml as xml']).limit(limit).offset(offset).getRawMany();

        const xmlContents = results.map(result => result.xml);
        return xmlContents.join('').toString();
    }

    public async userWishListProducts(request, count): Promise<any> {
        request.body.ptype = 'user-wishlist';
        // request.body.limit = 2000;
        // request.body.offset = 0;
        request.body.count = count;
        request.body.outOfStock = false
        const products = await this.listing(request);
        return products;

    }

    public async productsByArrayIds(productIds: any): Promise<any> {
        const selects = [
            'P.name as name',
            'P.longDesc as longDesc',
            'P.shortDesc as shortDesc',
            'P.bulletPoints as bulletPoints',
            'P.avgRating as avgRating',
            'P.reviewCount as reviewCount',
            'P.OneStarRatingCount as OneStarRatingCount',
            'P.TwoStarRatingCount as TwoStarRatingCount',
            'P.ThreeStarRatingCount as ThreeStarRatingCount',
            'P.FourStarRatingCount as FourStarRatingCount',
            'P.FiveStarRatingCount as FiveStarRatingCount',
            'VP.siteId as siteId',
            'VP.slug as productSlug',
            'VP.vendorId as vendorId',
            'VP.productId as productId',
            'VP.brandId as brandId',
            'VSP.storeName as vendorStoreName',
            'VSP.slug as vendorStoreSlug',
        ];

        const query: any = await getConnection().getRepository(VendorProduct).createQueryBuilder('VP')
        .select(selects)
        .leftJoin(VendorStoreProfile, 'VSP', 'VSP.userId = VP.vendorId')
        .innerJoin(Product, 'P', 'P.id = VP.productId')
        .andWhere('VP.productId IN (' + productIds + ')');
        return query.getRawMany();
    }

    public async searchProductsSuggestions(siteId, keyword, catId?): Promise<any> {
        // const searchCols = [
        //     { column: 'P.name' },
        // ];
        const individualWords = keyword.split(' ').map(word => word.toLowerCase());
        const selects = [
            'P.name as name',
        ];
        const query: any = await getConnection().getRepository(VendorProduct).createQueryBuilder('VP')
            .select(selects)
            .distinct(true)
            .innerJoin(Product, 'P', 'P.id = VP.productId')
            .innerJoin(Vendor, 'V', 'V.userId = VP.vendorId')
            .innerJoin(VendorProductVariants, 'VPV', 'VPV.productId = P.id')
            .where('VP.siteId = :siteId', { siteId })
            .andWhere('VP.statusId = :statusId', { statusId: 1 })
            // .andWhere(`P.name LIKE :keyword`, { keyword: `%${keyword}%` })
            .andWhere('V.statusId = :vendorStatus', { vendorStatus: VendorStatusEnum.Active })
            .andWhere(`(${individualWords.map(word => `LOWER(P.name) LIKE '%${word}%'`).join(' AND ')})`)
            .orderBy('P.name', 'ASC')

        if(catId){
            query.innerJoin(VendorProductCategory, 'VPC', 'VPC.vendorProductId = VP.id And VPC.categoryId = :catId', { catId })
            // query.innerJoin(Categories, 'C', 'C.id = VPC.categoryId')
        }
        if(siteId == SitesEnum.India) {
            query.andWhere('VPV.outOfStock = 0')
        }
        // keyword = keyword.replace(/[^\w\s]/gi, ' ');
        // keyword = keyword.includes(" ") ? keyword.split(" ")[0] : keyword;
        // searchCols.forEach((x, i) => {
        //     query.andWhere(new Brackets(qb => {
        //         if (i === 0) {
        //             qb.andWhere(`LOWER(${x.column}) LIKE '%${keyword}%'`);
        //         } else {
        //             qb.andWhere(`LOWER(${x.column}) LIKE '%${keyword}%'`);
        //             // qb.orWhere('LOWER(' + x.column + ')' + ' LIKE ' + '\'%' + keyword + '%\'');
        //         }
        //     })); 
        // });
        return query.getRawMany();
    }
    

    public async trendingDealsProducts(request): Promise<any> {
        const siteId = request.siteId;
        const selects = [
            // 'C.urlKey as urlKey',
        ]
        const results: any = await getConnection().getRepository(VendorProduct).createQueryBuilder('VP')
        .innerJoin(Product, 'P', 'P.id = VP.productId')
        .innerJoin(VendorStoreProfile, 'VSP', 'VSP.userId = VP.vendorId')
        .innerJoin(Vendor, 'Vendor', 'Vendor.userId = VP.vendorId AND Vendor.statusId = :status', { status: VendorStatusEnum.Active })
        .innerJoin(CronJobProduct, 'CJP', 'CJP.productId = P.id AND CJP.siteId = :siteId AND  CJP.cronJobType = :ptype', { siteId, ptype: 'TrendingDeals' })
        .innerJoin(VendorProductCategory, 'VPTC', 'VPTC.vendorProductId = VP.id')
        .leftJoin(Categories, 'C', 'C.id  = VPTC.categoryId')
        .where('VP.siteId = :siteId', { siteId: request.siteId })
        .andWhere('VP.statusId = 1')
        .orderBy('CJP.points', 'DESC')
        .groupBy('P.id')
        .select(selects).getRawMany();
        return results.map(item => {
            return {
                title: '',
                image: 'dummy/shoes.png',
                type: '',
                navigate_to: 'catalog_screen',
                slug: item.urlKey,
            }
        });
    }

    public async siteMapProductlisting(request): Promise<any> {
        const selects = [
            'VP.slug as slug'
        ];
        const query: any = await getConnection().getRepository(VendorProduct).createQueryBuilder('VP')
        .innerJoin(Product, 'P', 'P.id = VP.productId')
        .innerJoin(Users, 'Users', 'Users.userId = VP.vendorId')
        .innerJoin(Vendor, 'Vendor', 'Vendor.userId = VP.vendorId AND Vendor.statusId = :status', { status: VendorStatusEnum.Active })
        .innerJoin(VendorStoreProfile, 'VSP', 'VSP.userId = VP.vendorId')
        .innerJoin(VendorProductVariants, 'VPV', 'VPV.productId = VP.productId AND VPV.isActive = 1')
        .innerJoin(VendorProductCategory, 'VPTC', 'VPTC.vendorProductId = VP.id')
        .where('VP.siteId = :siteId', { siteId: request.siteId })
        .andWhere('VP.statusId = :statusId', { statusId: 1 })
        .orderBy('P.id', 'DESC')
        .groupBy('P.id');
        return query.select(selects).getRawMany();
    }

    public async listing(request): Promise<any> {
        const siteId = request.siteId;
        const { limit, offset, ptype, keyword, vendorId, brands, order, rating, count = 0, brandId, categoryId, campaignId, catId, vendorProductVariantIds, section_id, is_new_homepage, outOfStock } = request.body;
        console.log('keyword',keyword, 'order', order, siteId, section_id, 'ptype = ',ptype, 'OutOdStock:', outOfStock, 'is_new_homepage',is_new_homepage);
        let { price, from_price, to_price , variants, attr, variant } = request.body;
        if (!price) {
            price = 'ASC';
        }
        if (!from_price || from_price == 0) {
            from_price = 1;
        }
        if (!to_price || to_price == 0) {
            to_price = 100000000000;
        }
        // for android app
        if (variant && Array.isArray(variant)) {
            variants = variant;
        }
        // for IOS app
        if (variant && typeof variant == 'string') {
            try {
                variants = JSON.parse(variant);
            } catch (error) {}
        }
        // for IOS app
        if (attr && typeof attr == 'string') {
            try {
                attr = JSON.parse(attr)
            } catch (error) {}
        }
        const selects = [
            'VPV.id as vendorProductVariantId',
            'VPV.vendorId as vendorId',
            'VPV.siteId as siteId',
            'VPV.productId as productId',
            'VPV.productVariantId as productVariantId',
            'VPV.price as price',
            'VPV.price2 as price2',
            'VPV.isActive as isActive',
            'VPV.available as available',
            'VPV.outOfStock as outOfStock',
            'VPV.quantity as quantity',
            'VPV.isFeatured as isFeatured',
            'ProductVariantImages.image as image',
            'P.name as name',
            'ProductDiscount.price as pricerefer',
            'ProductDiscount.id as productDiscountId',
            `'${request.currencySymbol}' as currencySymbol`,
            'P.avgRating as avgRating',
            'P.OneStarRatingCount as OneStarRatingCount',
            'P.TwoStarRatingCount as TwoStarRatingCount',
            'P.ThreeStarRatingCount as ThreeStarRatingCount',
            'P.FourStarRatingCount as FourStarRatingCount',
            'P.FiveStarRatingCount as FiveStarRatingCount', 
            `P.reviewCount as reviewCount`,
            `ROUND((((VPV.price - ProductDiscount.price )/VPV.price )*100)) as discountPercentage`,
            'VPV.productSlug as productSlug',
            'VPV.brandId as brandId',
            'VPV.productStatus as statusId',
            'VPV.taxClassId as taxClassId',
            'TaxClass.value as taxValue',
            'TaxClass.name as taxClassName',
            'Brands.name as brandName',
            'ProductVariantImages.image as image',
            'ProductShippingInfo.type as ProductFreeShipping'
        ];
        const query: any = getConnection().getRepository(VendorProductVariants).createQueryBuilder('VPV')
        .innerJoin(
            subQuery => {
                return subQuery
                    .select('VPV.product_id', "product_id")
                    .addSelect("MIN(VPV.out_of_stock)", "min_out_of_stock")
                    .from("vendor_product_variants", "VPV")
                    .groupBy("VPV.product_id");
            },
            "min_out_of_stock",
            "VPV.product_id = min_out_of_stock.product_id AND VPV.out_of_stock = min_out_of_stock.min_out_of_stock"
        )
        .innerJoin(ProductVariantImages, 'ProductVariantImages', 'ProductVariantImages.productVariantsId = VPV.productVariantId AND ProductVariantImages.is_default = 1 ')
        .innerJoin(Product, 'P', 'P.id = VPV.productId')
        .leftJoin(ProductDiscount, 'ProductDiscount', 'ProductDiscount.vendorProductVariantId  = VPV.id AND NOW() >= ProductDiscount.startDate AND NOW() <= ProductDiscount.endDate')
        .innerJoin(VendorProduct, 'VP', 'VP.vendorId = VPV.vendorId AND VP.productId = VPV.productId AND VP.siteId = :siteId  AND VP.statusId = :statusId',{ siteId, statusId: 1 }) //1 for active
        .innerJoin(Brands, 'Brands', 'Brands.id = VP.brandId')
        .leftJoin(TaxClass, 'TaxClass', 'TaxClass.id = VP.taxClassId AND TaxClass.isActive = 1')
        .leftJoin(ProductShippingInfo, 'ProductShippingInfo', 'ProductShippingInfo.productId = VPV.productId AND ProductShippingInfo.charges = 0.00 AND ProductShippingInfo.type = :free and ProductShippingInfo.siteId = :siteId ', { free: 'free', siteId })
        .where(`CASE WHEN ProductDiscount.price IS NULL THEN VPV.price ELSE ProductDiscount.price END >= :from_price`, { from_price })
        .andWhere(`CASE WHEN ProductDiscount.price IS NULL THEN VPV.price ELSE ProductDiscount.price END <= :to_price`, { to_price })
        .andWhere('VPV.isActive = 1')
        .andWhere('VPV.vendorStatus = :vstatusId', { vstatusId: VendorStatusEnum.Active })
        .andWhere('VPV.productStatus = 1') //1 for Active
        .andWhere('VPV.siteId = :siteId', { siteId })
        .groupBy('P.id');
        if (categoryId && categoryId.length > 0) {
            if (categoryId.length === 1) {
                // It means there is no children for this category and this might be any category refering to any campaign (created as category).
                query.innerJoin(VendorProductCategory, 'VPTC', 'VPTC.vendorId = VPV.vendorId AND VPTC.productId = VPV.productId');
                query.andWhere('VPTC.categoryId IN (:...catId)', { catId: categoryId });
            } else {
                query.andWhere('VP.categoryId IN (:...catId)', { catId: categoryId });
            }
        }
        if(outOfStock) {
            query.andWhere('VPV.outOfStock = :outOfStockValue', { outOfStockValue: 0 });
        }
        if (vendorId) {
            query.andWhere('VPV.vendorId = ' + vendorId);
        }
        if (brandId) {
            query.andWhere('VPV.brandId = :brandId', { brandId });
        }
        if (catId && catId !== "") {
            // query.andWhere('VPTC.categoryId = :catId', { catId });
            query.andWhere('VP.categoryId = :catId', { catId: categoryId });
        }
        if (brands && brands.length > 0) {
            query.andWhere('VPV.brandId IN (' + brands + ')');
        }
        if (rating && rating !== 0) {
            query.andWhere('P.avgRating >= :rating', { rating });
        }
        if (price) {
            if (price == 'latest') {
                query.addOrderBy('VPV.createdAt', 'DESC');
            }
            if (price == 'brand') {
                query.addOrderBy('Brands.name', 'ASC');
            }
            if (price == 'featured') {
                query.addOrderBy('VP.isFeatured', 'DESC');
            }
            if (price == 'ASC' || price == 'DESC') {
                query.addOrderBy('IFNULL(ProductDiscount.price, VPV.price)', price);
            }
        }
        if (keyword) {
            this.searchProducts(query, keyword);
        }
        this.filterProductsByType(query, request, selects);
        if (vendorProductVariantIds && vendorProductVariantIds.length > 0) {
            query.innerJoin(RelatedProducts, 'RP', 'RP.relatedVariantId = VPV.id').andWhere('RP.relatedVariantId IN (' + vendorProductVariantIds + ')')
        }
        if (campaignId) {
            selects.push('Campaign.campaignId as campaignId')
            query.innerJoin(CampaignProducts, 'Campaign', 'Campaign.productId = P.id AND Campaign.campaignId = :campaignId AND Campaign.isActive = 1', { campaignId });
        }
        if (variants && variants.length > 0) {
            await this.filterByVariants(query, variants)
         }
         if (attr && attr.length > 0) {
             query.innerJoin(ProductAttributeVendorValue, 'PAT', 'P.id = PAT.productId AND PAT.categoryId = :categoryId', { categoryId });
             attr.map((item, _index) => {
                const PAI = item.productAttributeId;
                const VI = item.valueId;
                query.andWhere('PAT.productAttributeId = :PAI AND PAT.productAttributeValueId = :VI', { PAI, VI });
            });
        }
        if (count === 1) {
            return query.select(['P.id as id']).getRawMany();
        }
        query.addOrderBy('VPV.outOfStock', 'ASC');
        let result = await query.select(selects).limit(limit).offset(offset).getRawMany();
        return result;
    }
    
    public async listing2(request): Promise<any> {
        const { is_home, is_new_homepage, limit, offset, ptype, section_id, slug, outOfStock, categoryId } = request.body;
        console.log('slug', slug, 'is_home', is_home, 'is_new_homepage', is_new_homepage);
        const selects = [
            'VPV.id as vendorProductVariantId',
            'P.name as name',
            'P.avgRating as avgRating',
            'P.OneStarRatingCount as OneStarRatingCount',
            'P.TwoStarRatingCount as TwoStarRatingCount',
            'P.ThreeStarRatingCount as ThreeStarRatingCount',
            'P.FourStarRatingCount as FourStarRatingCount',
            'P.FiveStarRatingCount as FiveStarRatingCount', 
            // `(SELECT COUNT(productRating.id) FROM product_ratings as productRating WHERE productRating.product_id = P.id AND productRating.is_active = 1 ) as reviewCount`,
            'P.reviewCount as reviewCount',
            'ProductDiscount.price as pricerefer',
            'ProductDiscount.id as productDiscountId',
            'VPV.price as price',
            'VPV.price2 as price2',
            'VPV.quantity as quantity',
            'VPV.available as available',
            'VPV.outOfStock as outOfStock',
            'VPV.isActive as isActive',
            'VPV.isFeatured as isFeatured',
            'VPV.siteId as siteId',
            'VPV.productVariantId as productVariantId',
            'VP.slug as productSlug',
            'VP.vendorId as vendorId',
            'VP.productId as productId',
            'VP.statusId as statusId',
            'VP.brandId as brandId',
            'VP.taxClassId as taxClassId',
            'TaxClass.value as taxValue',
            'TaxClass.name as taxClassName',
            `'${request.currencySymbol}' as currencySymbol`,
            'SP.sort_order as sectionProduct_sort_order',
            'ProductShippingInfo.type as ProductFreeShipping',
            'ProductVariantImages.image as image',
            `ROUND((((VPV.price - ProductDiscount.price )/VPV.price )*100)) as discountPercentage`,
            'Brands.name as brandName'
        ];
    
        const siteId = request.siteId;

        // const query: any = getConnection().getRepository(VendorProductVariants).createQueryBuilder('VPV')
        // .innerJoin(ProductVariantImages, 'ProductVariantImages', 'ProductVariantImages.productVariantsId = VPV.productVariantId AND ProductVariantImages.is_default = 1 ')
        // .innerJoin(Product, 'P', 'P.id = VPV.productId')
        // .leftJoin(ProductDiscount, 'ProductDiscount', 'ProductDiscount.vendorProductVariantId  = VPV.id')
        // .innerJoin(VendorProduct, 'VP', 'VP.vendorId = VPV.vendorId AND VP.productId = VPV.productId AND VP.siteId = :siteId  AND VP.statusId = :statusId',{ siteId, statusId: 1 }) //1 for active
        // .innerJoin(Brands, 'Brands', 'Brands.id = VP.brandId')
        // .innerJoin(VendorProductCategory, 'VPTC', 'VPTC.vendorId = VPV.vendorId AND VPTC.productId = VPV.productId')
        // .leftJoin(TaxClass, 'TaxClass', 'TaxClass.id = VP.taxClassId AND TaxClass.isActive = 1')
        // .leftJoin(ProductShippingInfo, 'ProductShippingInfo', 'ProductShippingInfo.productId = VPV.productId AND ProductShippingInfo.charges = 0.00 AND ProductShippingInfo.type = :free and ProductShippingInfo.siteId = :siteId ', { free: 'free', siteId })
        // .where(`CASE WHEN ProductDiscount.price IS NULL THEN VPV.price ELSE ProductDiscount.price END >= :from_price`, { from_price })
        // .andWhere(`CASE WHEN ProductDiscount.price IS NULL THEN VPV.price ELSE ProductDiscount.price END <= :to_price`, { to_price })
        // .andWhere('VPV.isActive = 1')
        // .groupBy('P.id');



        const query = getConnection().getRepository(VendorProductVariants).createQueryBuilder('VPV')
        .innerJoin(
            subQuery => {
                return subQuery
                    .select('VPV.product_id', "product_id")
                    .addSelect("MIN(VPV.out_of_stock)", "min_out_of_stock")
                    .from("vendor_product_variants", "VPV")
                    .groupBy("VPV.product_id");
            },
            "min_out_of_stock",
            "VPV.product_id = min_out_of_stock.product_id AND VPV.out_of_stock = min_out_of_stock.min_out_of_stock"
        )
        .leftJoin(ProductVariantImages, 'ProductVariantImages', 'ProductVariantImages.productVariantsId = VPV.productVariantId AND ProductVariantImages.is_default = 1 ')
        .innerJoin(Product, 'P', 'P.id = VPV.productId')
        .innerJoin(VendorProduct, 'VP', 'VP.vendorId = VPV.vendorId AND VP.productId = VPV.productId AND VP.siteId = :siteId  AND VP.statusId = :statusId',{ siteId, statusId: 1 }) //1 for active
        .innerJoin(Brands, 'Brands', 'Brands.id = VP.brandId')
        // .innerJoin(Vendor, 'V', 'V.userId = VPV.vendorId AND V.statusId = :vstatusId', { vstatusId: 'Active' })
        .leftJoin(ProductDiscount, 'ProductDiscount', 'ProductDiscount.vendorProductVariantId  = VPV.id AND NOW() >= ProductDiscount.startDate AND NOW() <= ProductDiscount.endDate')
        .leftJoin(ProductShippingInfo, 'ProductShippingInfo', 'ProductShippingInfo.product_id = P.id AND ProductShippingInfo.charges = 0.00 AND ProductShippingInfo.type =:free and ProductShippingInfo.site_id =:siteId ', { free: 'free', siteId: siteId })
        // .innerJoin(ProductVariants, 'PV', 'PV.product_id  = P.id')
        // .innerJoin(VendorProductCategory, 'VPTC', 'VPTC.vendorId = VPV.vendorId AND VPTC.productId = VPV.productId')
        .leftJoin(TaxClass, 'TaxClass', 'TaxClass.id = VP.taxClassId AND TaxClass.isActive = 1')
        // .innerJoin(SectionProducts, 'SP', 'SP.product_id = P.id AND SP.section_id = :section_id', { section_id: section_id })
        .where('VPV.isActive = 1')
        .andWhere('VPV.vendorStatus = :vstatusId', { vstatusId: VendorStatusEnum.Active })
        .groupBy('P.id');


        if (outOfStock) {
            query.andWhere('VPV.outOfStock = :outOfStockValue', { outOfStockValue: 0 });
        }
        // if(request.siteId == SitesEnum.India) {
        //     query.andWhere('VPV.outOfStock = 0')
        // }
    
        if (ptype && ['FP', 'OSP', 'TDP', 'TRP', 'TSP'].includes(ptype)) {
            query.innerJoin(CronJobProduct, 'CJP', 'CJP.productId = P.id AND CJP.siteId = :siteId AND CJP.cronJobType = :ptype', { siteId, ptype });
            query.leftJoin(SectionProducts, 'SP', 'SP.product_id = P.id AND SP.section_id = :section_id', { section_id: section_id });
            // query.addOrderBy('ISNULL(SP.sort_order)', 'ASC'); 12121212
            query.addOrderBy('SP.sort_order IS NULL', 'ASC');
            query.addOrderBy('SP.sort_order', 'ASC');
            query.addOrderBy('CJP.points', 'DESC');
            
        } else {
            query.leftJoin(SectionProducts, 'SP', 'SP.product_id = P.id AND SP.section_id = :section_id', { section_id: section_id })
            query.addOrderBy("SP.sort_order IS NULL", "ASC");
            query.addOrderBy("SP.sort_order", "ASC");
            if (categoryId && categoryId.length > 0) {
                query.andWhere('VP.categoryId IN (:...catId)', { catId: categoryId });
            }
        }
        const result = await query.select(selects).limit(limit).offset(offset).getRawMany();
        return result;
    }

    public async relatedProductListing(request: any): Promise<any> {
        const VPForRelProducts: any = await getConnection().getRepository(VendorProduct).createQueryBuilder('VP').andWhere('VP.slug =:Pslug', { Pslug: request.body.slug }).getOne();
        const relatedVariantIds = await this.relatedProductService.getRelatedVariantIdsByProductId(VPForRelProducts.productId);
        if (relatedVariantIds.length === 0) {
            return [];
        }
        request.body.vendorProductVariantIds = relatedVariantIds;
        return await this.listing(request);
    }
    

    public async productIds(categoryId: number, request: any): Promise<any> {
        // const selects = [
        //     'VP.productId as productId'
        // ];
        // const query: any = await getConnection().getRepository(VendorProduct).createQueryBuilder('VP');
        // query.innerJoin(VendorProductCategory, 'VPTC', 'VPTC.vendorProductId = VP.id');
        // query.innerJoin(Categories, 'C', 'C.id = VPTC.categoryId AND C.id = :catId', { catId: categoryId });
        // query.select(selects);
        
        // return query.getRawMany();


        const selects = [
            'VP.productId as productId'
        ];
        const query: any = await getConnection().getRepository(VendorProduct).createQueryBuilder('VP')
        .innerJoin(Product, 'P', 'P.id = VP.productId')
        .innerJoin(Users, 'Users', 'Users.userId = VP.vendorId')
        .innerJoin(Vendor, 'Vendor', 'Vendor.userId = VP.vendorId AND Vendor.statusId = :status', { status: VendorStatusEnum.Active })
        .innerJoin(VendorStoreProfile, 'VSP', 'VSP.userId = VP.vendorId')
        .innerJoin(VendorProductVariants, 'VPV', 'VPV.productId = VP.productId AND VPV.isActive = 1')
        .innerJoin(VendorProductCategory, 'VPTC', 'VPTC.vendorProductId = VP.id')
        .leftJoin(Categories, 'C', 'C.id  = VPTC.categoryId')
        .where('VP.siteId = :siteId', { siteId: request.siteId })
        .andWhere('VPTC.categoryId IN (:...catId)', { catId: [categoryId] })
        .groupBy('P.id');
        return query.select(selects).getRawMany();
    }

    public async listingV2({ limit, offset, ptype, vendorId, brandId, categoryId, campaignId, brands, rating }: ProductListingFuncInterface): Promise<any> {
        // const { keyword, order, count = 0, attr, variants, from_price, to_price } = request.body;
    }

    public filterByRating(query: any, rating: any): void {
        // we are saving count of 1,2,3,4,5 stars of all ratings individually in columns
        if (rating !== 0) {
            if (rating == 1) {
                query.andWhere('P.OneStarRatingCount != 0');
            }
            if (rating == 2) {
                query.andWhere('P.TwoStarRatingCount != 0');
            }
            if (rating == 3) {
                query.andWhere('P.ThreeStarRatingCount != 0');
            }
            if (rating == 4) {
                query.andWhere('P.FourStarRatingCount != 0');
            }
            if (rating == 5) {
                query.andWhere('P.FiveStarRatingCount != 0');
            }
        }
        
    }

    public searchProducts(query: any, keyword: string): void {
        // query.andWhere(`P.name LIKE :keyword`, { keyword: `%${keyword}%` });
            const individualWords = keyword.split(' ').map(word => word.toLowerCase());

                // query.andWhere(new Brackets(qb => {
                //     for (const word of individualWords) {
                //       qb.andWhere(`LOWER(P.name) LIKE :word`, { word: `%${word}%` });
                //     }
                //   }))
                //   .groupBy('VP.id');
                query.andWhere(`(${individualWords.map(word => `LOWER(P.name) LIKE '%${word}%'`).join(' AND ')})`)
                .groupBy('VP.id')
                .orderBy('P.name', 'ASC');
          

        // keyword = keyword.replace(/[^\w\s]/gi, ' ');
        // query.andWhere(new Brackets(qb => {
        //     qb.andWhere(`LOWER(P.name) LIKE '${keyword}%'`);
        //     keyword = keyword.includes(" ") ? keyword.split(" ")[0] : keyword;
        //     qb.orWhere(`LOWER(P.name) LIKE '%${keyword}%'`);
        // })); 
        // const searchCols = [
        //     { column: 'P.name' },
        // ];
        // searchCols.forEach((x, i) => {
        //     query.andWhere(new Brackets(qb => {
        //         if (i === 0) {
        //             qb.andWhere(`LOWER(${x.column}) LIKE '${keyword}%'`);
        //             qb.orWhere(`LOWER(${x.column}) LIKE '${keyword}%'`);
        //         } else {
        //             qb.andWhere(`LOWER(${x.column}) LIKE '${keyword}%'`).orWhere(`LOWER(${x.column}) LIKE '${keyword}%'`);
        //         }
        //     })); 
        // });
        // keyword = keyword.includes(" ") ? keyword.split(" ")[0] : keyword;
        // searchCols.forEach((x, i) => {
        //     query.orWhere(new Brackets(qb => {
        //         if (i === 0) {
        //             qb.andWhere(`LOWER(${x.column}) LIKE '%${keyword}%'`);
        //         } else {
        //             qb.andWhere(`LOWER(${x.column}) LIKE '%${keyword}%'`);
        //         }
        //     })); 
        // });

        // query.andWhere(new Brackets(qb => {
        //     qb.where(`LOWER(P.name) LIKE '${keyword}%'`);
        //     if (keyword.includes(" ")) {
        //         let words = keyword.split(" ");
        //         words.forEach((w, i) => {
        //             qb.orWhere(`LOWER(P.name) LIKE '%${w}%'`);
        //         });
        //     }
        // }));
        
        // if (keyword.includes(" ")) {
        //     let words = keyword.split(" ");
        //     words.forEach((w, i) => {
        //         searchCols.forEach((x, i) => {
        //             query.orWhere(new Brackets(qb => {
        //                 if (i === 0) {
        //                     qb.andWhere(`LOWER(${x.column}) LIKE '%${w}%'`);
        //                 } else {
        //                     qb.andWhere(`LOWER(${x.column}) LIKE '%${w}%'`);
        //                 }
        //             })); 
        //         });
        //     });
        // } 
    }

    public filterProductsByType(query: any, request: any, selects: any): void {
        const user = request.user;
        const { ptype } = request.body;
        const siteId = request.siteId;
        // ptypes in cron job types table: Featured, Today Deals, Top Rated, Top Selling Products
        // 'FP', 'OSP', 'TDP', 'TRP', 'TSP'
        if (ptype) {
            if (ptype === 'FP' || ptype === 'OSP' || ptype === 'TDP' || ptype === 'TRP' || ptype === 'TSP') {
                query.innerJoin(CronJobProduct, 'CJP', 'CJP.productId = VPV.productId AND CJP.siteId = :siteId AND CJP.cronJobType = :ptype', { siteId, ptype });
                query.addOrderBy('CJP.points', 'DESC');
                selects.push('CJP.cronJobType as cronJobType')
                // if(ptype === 'TRP') {
                //     query.addOrderBy('P.avgRating', 'DESC');
                // } else if(ptype === 'TSP') {
                //     query.addOrderBy('soldCount', 'DESC');
                // }
            }
            if (ptype === 'browsing-history') {
                if (request.user.userId) {
                    query.innerJoin(UserBrowsingHistory, 'UBH', 'UBH.productId = P.id AND UBH.deleted = 0 AND UBH.userId = :id', { id: user.userId });
                }
            }
        }
        if (user) {
            selects.push('UWL.wishlistProductId as wishlistProductId');
            if (ptype && ptype === 'user-wishlist') {
                query.innerJoin(UserWishlist, 'UWL', 'UWL.productId = P.id AND UWL.userId = :userId', { userId: user.userId });
            } else {
                query.leftJoin(UserWishlist, 'UWL', `UWL.productId = P.id AND UWL.userId = ${user.userId}`);
            } 
        }
    }

    public async productListing_ResponseStructure(productList: any, request: any): Promise<any> {
        const siteId = request.siteId;
        productList = productList.map(async (item) => {
            const pricing = await this.productDiscount({ siteId, productId: item.productId, vendorId: item.vendorId, is_outOfStock: request.body.outOfStock,  vendorProductVariantId: item.vendorProductVariantId });
            const productRating = await this.getProductRatingByProductId(item.productId);
            // if there is any tax value
            // if (item.taxValue) {
            //     pricing.price = parseFloat(pricing.price) + (parseFloat(pricing.price) * parseFloat(item.taxValue) / 100);
            //     pricing.pricerefer = parseFloat(pricing.pricerefer) + (parseFloat(pricing.pricerefer) * parseFloat(item.taxValue) / 100);
            // }
            const obj: any = {
                cronJobType: '',
                taxClassId: item.taxClassId,
                taxValue: item.taxValue,
                taxClassName: item.taxClassName,
                statusId: item.statusId,
                name: item.name,
                image: pricing.image,
                reviewCount: productRating.reviewCount,
                avgRating: item.reviewCount == 0 ? "0.00": productRating.avgRating,
                productSlug: item.productSlug,
                price: formatPrice(siteId,pricing.price),
                pricerefer: formatPrice(siteId,pricing.pricerefer),
                productDiscountId: pricing.productDiscountId,
                discountPercentage: pricing.discountPercentage,
                outOfStock: pricing.outOfStock,
                available: pricing.available,
                navigate_to: 'product_details_screen',
                vendorId: item.vendorId,
                productId: item.productId,
                productVariantId: pricing.productVariantId,
                currencySymbol: request.currencySymbol,
                vendorStoreSlug: item.vendorStoreSlug,
                vendorStoreName: item.vendorStoreName,
                tag: "",
                // tag: item.vendorStoreName,
                campaignId: item.campaignId,
                category: item.category,
                categoryDescription: item.categoryDescription,
                soldCount: Number(item.soldCount),
                ordersInLast24Hours: item.ordersInLast24Hours,
                vendorProductVariantId: item.vendorProductVariantId,

                sectionProduct_id: item.sectionProduct_id,
                sectionProduct_section_id: item.sectionProduct_section_id,
                sectionProduct_product_id: item.sectionProduct_product_id,
                sectionProduct_sort_order: item.sectionProduct_sort_order,
                sectionProduct_is_active: item.sectionProduct_is_active
            };
            if (item.cronJobType) {
                obj.cronJobType = item.cronJobType;
            }
            const deviceCheck = request.header('device');
            if (deviceCheck) {
                if (deviceCheck === 'web') {
                    const shippingCharges = await this.getProductShippingDetails(item.productId, item.siteId);
                    obj.variantValue = pricing.variantValue ? pricing.variantValue : null;
                    obj.shippingCharges = shippingCharges;
                    obj.siteId = item.siteId;
                    obj.brandId = item.brandId;
                    // obj.categoryName = 'categoryName';
                    obj.wishListStatus = item.wishlistProductId ? 1 : 0;
                }
            }
            return obj;
        });
        productList = await Promise.all(productList);
        return productList;
    }

    public async getProductShippingDetails(productId: number, siteId: any): Promise<any> {
        const query = await getConnection().getRepository(ProductShippingInfo).createQueryBuilder('PSI').select('*')
        .where('PSI.siteId = :siteId AND PSI.productId = :productId', {siteId, productId })
        .orderBy(`(case type WHEN 'express' THEN 3 WHEN 'standard' THEN 2 WHEN 'free' THEN 1 ELSE 0 END)`)
        .getRawMany();
        return  query.map((x, y) => {
            const expected_date = moment().add('days', x.days).format('MMMM Do YYYY')
            const obj: any = {
                id: x.id,
                deliver_on: x.days,
                expected_date,
                charges: formatPrice(siteId, x.charges),
                text: '',
                image: '',
                selected: y == 0 ? true : false
            }
            if (x.type === 'free') {
                obj.text = 'Free Delivery';
                obj.image = 'buyer-product-assets/Free_delivery.png';
            }
            if (x.type === 'standard') {
                obj.text = 'Standard Delivery';
                obj.image = 'buyer-product-assets/standard_delivery.png';
            }
            if (x.type === 'express') {
                obj.text = 'Express Delivery';
                obj.image = 'buyer-product-assets/express_delivery.png';
            }
            return obj;
        });
    }

    public async comboDetails(productId: any, siteId: number, todaydate: any, response: any, vendorId?: number): Promise<any> {
        let variants = await this.productVariantValueService.getProduct_Variants(productId);
        variants = variants.map(async (item, index) => {
            const varientsValue = await this.productVariantValueService.varaintValues(item.productId, item.id);
            return {
                ...item,
                varientsValue,
            };
        });
        variants = await Promise.all(variants);
        let productvariants: any = await this.productVariantsService.find({ where: { productId } });
        productvariants = productvariants.map(async (item, index) => {
            const vv = await this.vendorProductVariantsService.findOne({ where: { productVariantId: item.id } });
            const vdiscount = await this.productDiscountService.findByVariantId(vv.id);
            const vvalue = await this.productVariantsService.findOne({ where: { id: vv.productVariantId } });
            const vimages = await this.productVariantImagesService.find({ where: { productVariantsId: item.id } });
            const va = vimages.map((a, b) => {
                return {
                    image: a.image,
                    containerName: '',
                    defaultImage: a.isDefault,
                };
            });
            return {
                varientName: vvalue.productVariantValuesId,
                price: formatPrice(siteId,vv.price),
                sku: vv.sku,
                skuName: vv.sku,
                // minQuantityAllowedCart: 1,
                // maxQuantityAllowedCart: 5,
                // stockStatus: 'outOfStock',
                pricerefer: vdiscount ? formatPrice(siteId,vdiscount.price) : null,
                optionImage: await Promise.all(va),
            };
        });
        productvariants = await Promise.all(productvariants);
        return productvariants
    }

    public async productDetailsV2(slug: string, siteId: number, vendorId?: number): Promise<any> {
        const selects = [
            // Meta info of product
            'PMI.title as metaTitle',
            'PMI.keyword as metaKeyword',
            'PMI.description as metaDescription',
            // Vendor Product Variants
            'VPV.id as vendorProductVariantId',
            'VPV.vendorId as vendorId',
            'VPV.productId as productId',
            'VPV.siteId as siteId',
            'VPV.productVariantId as productVariantId',
            'VPV.price as price',
            'VPV.isActive as isActive',
            'VPV.available as available',
            'VPV.outOfStock as outOfStock',
            'VPV.quantity as quantity',
            'VPV.isFeatured as isFeatured',
            // vendor store profile
            'VendorStoreProfile.storeName as vendorStoreName',
            'VendorStoreProfile.slug as vendorStoreSlug',
            // // product columns
            'Product.avgRating as avgRating',
            'Product.reviewCount as reviewCount',
            'Product.OneStarRatingCount as OneStarRatingCount',
            'Product.TwoStarRatingCount as TwoStarRatingCount',
            'Product.ThreeStarRatingCount as ThreeStarRatingCount',
            'Product.FourStarRatingCount as FourStarRatingCount',
            'Product.FiveStarRatingCount as FiveStarRatingCount',
            'Product.name as name',
            'Product.longDesc as longDesc',
            'Product.shortDesc as shortDesc',
            'Product.bulletPoints as bulletPoints',
            // // vendor product columns
            'VendorProduct.slug as slug',
            'VendorProduct.bulkQuote as bulkQuote',
            'VendorProduct.COD as COD',
            'VendorProduct.returnDays as returnDays',
            'ProductVariants.productVariantValuesId as productVariantValuesId',
            // // brand columns
            'Brands.name as brand',
            'Brands.id as brandId',
            // discount cols
            'PD.price as variantDiscountPrice',
            'PD.id as variantDiscountId',
            'PD.startDate as variantDiscountStartDate',
            'PD.endDate as variantDiscountEndDate',
        ];
        const allVariantsData: any = await getConnection().getRepository(VendorProductVariants).createQueryBuilder('VPV')
        .innerJoin(Users, 'User', 'User.userId = VPV.vendorId')
        .innerJoin(VendorStoreProfile, 'VendorStoreProfile', 'VendorStoreProfile.userId = VPV.vendorId')
        .innerJoin(Vendor, 'Vendor', 'Vendor.userId = VPV.vendorId AND Vendor.statusId = :status', { status: 'Active' })
        .innerJoin(Product, 'Product', 'Product.id = VPV.productId')
        .innerJoin(ProductVariants, 'ProductVariants', 'ProductVariants.id = VPV.productVariantId')
        .innerJoin(VendorProduct, 'VendorProduct', 'VendorProduct.vendorId = VPV.vendorId AND VendorProduct.productId = VPV.productId AND VendorProduct.siteId = VPV.siteId')
        .leftJoin(ProductMetaInfo, 'PMI', 'PMI.productId = VPV.productId AND PMI.siteId = :siteId', { siteId })
        .leftJoin(Brands, 'Brands', 'Brands.id = VendorProduct.brandId')
        .leftJoin(ProductDiscount, 'PD', 'PD.vendorProductVariantId = VPV.id AND PD.startDate <= NOW()')
        .where('VendorProduct.slug = :slug AND VendorProduct.statusId = 1 AND VendorProduct.siteId = :siteId', { slug, siteId })
        .orderBy('VPV.price', 'ASC')
        .select(selects).getRawMany();

        // sorting ASC by discount price if exists
        let productvariantList = allVariantsData.sort((a, b) => {
            a = a.variantDiscountPrice ? parseFloat(a.variantDiscountPrice) : 1000000000;
            b = b.variantDiscountPrice ? parseFloat(b.variantDiscountPrice) : 1000000000;
            return a - b;
        });
        // get images for each variant
        const productVariantIds = allVariantsData.map(v => v.productVariantId);
        let allImages = await this.productVariantImagesService.find({ where: { productVariantsId: In(productVariantIds) }});
        productvariantList = allVariantsData.map(variant => {
            let images = allImages.filter(image => image.productVariantsId == variant.productVariantId);
            images = orderBy(images, ['isDefault'],['desc']);
            const a = JSON.parse(variant.productVariantValuesId);
            const b = a.map((x, y) => x.value).join(',');
            const variantObj: any = {
                ...variant,
                variantValue: b,
                variant: variant.productVariantValuesId,
                pricerefer: variant.variantDiscountPrice ? formatPrice(siteId,variant.variantDiscountPrice) : '',
                productDiscountId: variant.variantDiscountId ? variant.variantDiscountId : 0,
                images,
            };
            return variantObj;
            
        });
        const shippingCharges = await this.getProductShippingDetails(allVariantsData[0].productId, siteId);
        return {
            productvariantList,
            shippingCharges
        };
    }

    public async productDetails({slug, siteId, vendorId, sellerView }: ProductDetailsFunc): Promise<any> {
        const selects = [
            'User.firstName as firstName',
            'User.lastName as lastName',
            'VSP.storeName as vendorStoreName',
            'VSP.slug as vendorStoreSlug',
            'COUNT(DISTINCT SO.productId) as itemsSold',
            'COUNT(SO.productId) as sales',
            // product columns
            'P.avgRating as avgRating',
            'P.reviewCount as reviewCount',
            'P.OneStarRatingCount as OneStarRatingCount',
            'P.TwoStarRatingCount as TwoStarRatingCount',
            'P.ThreeStarRatingCount as ThreeStarRatingCount',
            'P.FourStarRatingCount as FourStarRatingCount',
            'P.FiveStarRatingCount as FiveStarRatingCount',
            'P.name as name',
            'P.longDesc as longDesc',
            'P.moreInformation as moreInformation',
            'P.shortDesc as shortDesc',
            'P.bulletPoints as bulletPoints',
            // vendor product columns
            'VP.siteId as siteId',
            'VP.vendorId as vendorId',
            'VP.productId as productId',
            'VP.slug as slug',
            'VP.bulkQuote as bulkQuote',
            'VP.COD as COD',
            'VP.COD as COD',
            'VP.returnDays as returnDays',
            'VP.statusId as statusId',
            'VP.sizeChartImage as sizeChartImage',
            'VP.fakeOrders as fakeOrders',
            'VP.id as vendorProductId',
            // brand columns
            'Brands.name as brand',
            'Brands.id as brandId',
            'Brands.is_active as isBrandActive',
            // Meta info of product
            'PMI.title as metaTitle',
            'PMI.keyword as metaKeyword',
            'PMI.description as metaDescription',
            // 'VendorProduct.returnDays as returnDays'

            'VP.taxClassId as taxClassId',
            'TaxClass.value as taxValue',
            'TaxClass.name as taxClassName'
        ];
        const query: any = await getConnection().getRepository(VendorProduct).createQueryBuilder('VP')
        .innerJoin(Product, 'P', 'P.id = VP.productId')
        .innerJoin(Users, 'User', 'User.userId = VP.vendorId')
        .innerJoin(VendorStoreProfile, 'VSP', 'VSP.userId = VP.vendorId')
        .leftJoin(Brands, 'Brands', 'Brands.id = VP.brandId')
        .leftJoin(ProductMetaInfo, 'PMI', 'PMI.productId = VP.productId AND PMI.siteId = :siteId', { siteId })
        .leftJoin(SubOrder, 'SO', 'SO.vendorId = VSP.userId AND SO.statusId IN (5,8,10)')
        .leftJoin(TaxClass, 'TaxClass', 'TaxClass.id = VP.taxClassId AND TaxClass.isActive = 1')
        .where('VP.slug = :slug AND VP.siteId = :siteId', { slug, siteId });
        if (sellerView) {
            query.innerJoin(Vendor, 'Vendor', 'Vendor.userId = VP.vendorId');
        } else {
            query.innerJoin(Vendor, 'Vendor', 'Vendor.userId = VP.vendorId AND Vendor.statusId = :status', { status: VendorStatusEnum.Active });
            query.andWhere('VP.statusId = 1');
        }
        if (vendorId) {
            query.andWhere('VP.vendorId = :vendorId', { vendorId });
        }
        return query.select(selects).getRawOne();
    }

    public async productDiscount({ productId, siteId, vendorId, vendorProductVariantId }: ProductDiscountFunc): Promise<any> {
        const conditions = {
            vendorId: vendorId,
            productId: productId,
            siteId: siteId,
            isActive: 1,
            id: vendorProductVariantId
        }
        // is_outOfStock ? conditions['outOfStock'] = 0 : '';
        const pvariants = await this.vendorProductVariantsService.find({ where: conditions, order: { price: 'ASC' }});
        console.log('pvariants', pvariants);
        const pvIds = pvariants.map((x, y) => x.id);
        const discounts = await this.productDiscountService.getAll_VariantDiscounts_OfProduct(pvIds);
        const obj: any = {
            productDiscountId: 0,
            price: '',
            pricerefer: '',
            discountPercentage: '',
            variantValue: '',
            productVariantId: 0,
            outOfStock: 0,
            available: 0,
            slug: '',
            image: 'seller_store_logo_placeholder.png'
        };
        // if any variant will have discount
        if (discounts.length > 0) {
            const discountOfVariant = discounts[0];
            const variant = pvariants.find((item, i) => item.id === discountOfVariant.vendorProductVariantId);
            // ----------------------------------------------------------------------------
            obj.outOfStock = variant.outOfStock;
            obj.available = variant.available;
            obj.productVariantId = variant.productVariantId;
            const b = await this.productVariantsService.findOne({ where: { id: variant.productVariantId }});
            obj.variantValue = b.productVariantValuesId;

            // ------------------------------------------
            obj.pricerefer = discountOfVariant.price;
            obj.productDiscountId = discountOfVariant.productDiscountId;
            obj.price = variant.price;
            const a: any = ((parseFloat(obj.price) - parseFloat(obj.pricerefer)) / parseFloat(obj.price)) * 100;
            obj.discountPercentage = parseInt(a).toString();
        }
        // if there is no discount
        if (discounts.length === 0) {
            const v = pvariants[0];
            console.log(v)
            if (v) {
                obj.price = v.price;
                obj.outOfStock = v.outOfStock;
                obj.available = v.available;
                obj.productVariantId = v.productVariantId;
                obj.slug = v.slug;
                // -----------------------------------------------
                const a = await this.productVariantsService.findOne({ where: { id: v.productVariantId }});
                obj.variantValue = a.productVariantValuesId;
            }
        }
        // siteId is 1 = Pakistan, 2 = India 3 = US. show decimal only for US
        if (siteId == 1) {
            obj.price = parseInt(obj.price).toString();
            obj.pricerefer = obj.pricerefer ? parseInt(obj.pricerefer).toString() : '';
        }
        if (siteId == 3 || siteId == 2) {
            obj.price = obj.price.toString();
            obj.pricerefer = obj.pricerefer ? obj.pricerefer.toString() : '';
        }
        if (obj.productVariantId) {
            const image = await this.productVariantImagesService.findOne({ where: { productVariantsId: obj.productVariantId, isDefault: 1 }});
            if (image) {
                obj.image = image.image;
            }
        }
        obj.productVariantId = Number(obj.productVariantId);
        return obj;
    }

    public async userCartProducts(cartItems: any, request: any): Promise<any> {
        let cart: any = [];
        // get unique vendorId to structure the json response for web and mobile app 
        const key = 'vendorId';
        const uniques: any = [...new Map(cartItems.map(item => [item[key], item])).values()];
        cart = uniques.map((item, index) => {
            // --------------------------------------------------------------------------------
            const productsOfSameVendor = cartItems.filter((x, y) => x.vendorId === item.vendorId);

            const products: any = [];
            // // get unqiue products here
            const uniquesProducts: any = [...new Map(productsOfSameVendor.map(abc => [abc['productId'], abc])).values()];
            uniquesProducts.map((p, i) => {
                const a = cartItems.filter((x, y) => x.productId === p.productId);
                products.push({
                    productId: p.productId,
                    variants: a,
                });
            });

            return {
                vendorId: item.vendorId,
                products,
            };
        });
        // now get product details of user cart list
        cart = cart.map(async (a, b) => {
            let vendorStore: any = {};
            if(a.vendorId){
                vendorStore = await this.vendorStoreProfileService.findOne({ where: { userId: a.vendorId }});
            }
            const xyz = a.products.map(async (x, y) => {
                const updatedItem = x.variants.map(async (item, index) => {
                    const getCartProduct = await this.getCartProductDetails(item);
                    if(getCartProduct) {
                        const dp = await this.productDiscountService.findByVariantId(item.productVariantId);
                        const obj: any = {
                            ...getCartProduct,
                            variant: getCartProduct.variant && JSON.parse(getCartProduct.variant),
                            discountPercentage: '',
                            pricerefer: '',
                            quantity: item.quantity,
                            productDiscountId: 0,
                            outOfStock: getCartProduct.outOfStock
                        };
                        // if there is any tax value
                        // if (getCartProduct.taxValue) {
                        //     obj.price = parseFloat(getCartProduct.price) + (parseFloat(getCartProduct.price) * parseFloat(getCartProduct.taxValue) / 100);
                        // }
                        if (dp) {
                            obj.productDiscountId = dp.productDiscountId;
                            obj.pricerefer = dp.price;
                            // // if there is any tax value
                            // if (getCartProduct.taxValue) {
                            //     obj.pricerefer = parseFloat(dp.price) + (parseFloat(dp.price) * parseFloat(getCartProduct.taxValue) / 100);
                            // }
                            const a: any = ((parseFloat(obj.price) - parseFloat(obj.pricerefer)) / parseFloat(obj.price)) * 100;
                            obj.discountPercentage = parseInt(a).toString();
                        }
                        return obj;
                    }
                });
                const f = await Promise.all(updatedItem);
                const shippingCharges = await this.getProductShippingDetails(x.productId, request.siteId);
                x.shippingCharges = shippingCharges;
                x.variants = f;
                return x;
            });
            await Promise.all(xyz);
            return {
                vendorId: a.vendorId,
                vendorStoreName: vendorStore ? vendorStore.storeName: null,
                vendorStoreSlug: vendorStore ? vendorStore.slug: null,
                currencySymbol: request.currencySymbol,
                products: await Promise.all(xyz),
            }
            return a;
        });
        cart = await Promise.all(cart);
        return cart;
    }

    public async getCartProductDetails(cartItem: any): Promise<any> {
        if(!cartItem) {
            return false;
        }
        const selects = [
            'P.id as productId',
            'P.avgRating as avgRating',
            'VPV.vendorId as vendorId',
            'VP.slug as productSlug',
            'PV.id as productVariantId',
            'VPV.siteId as siteId',
            'VPV.id as VPV_Id',
            'P.name as name',
            'VPV.price as price',
            'VPV.outOfStock as outOfStock',
            'PV.productVariantValuesId as variant',
            '(SELECT pvi.image FROM product_variant_images pvi WHERE pvi.product_variants_id = PV.id AND pvi.is_default = 1 LIMIT 1) as image',
            '(SELECT COUNT(PR.id) FROM product_ratings PR WHERE PR.product_id = P.id AND PR.is_active = 1 ) as reviewCount',
        ];
        const query: any = await getConnection().getRepository(Product).createQueryBuilder('P')
        .innerJoin(ProductVariants, 'PV', `PV.productId = P.id AND PV.id = ${cartItem.productVariantId}`)
        .innerJoin(VendorProductVariants, 'VPV', `VPV.productId = P.id AND VPV.vendorId = ${cartItem.vendorId} AND VPV.productVariantId = PV.id`)
        .innerJoin(VendorProduct, 'VP', `VP.productId = P.id AND VP.vendorId = ${cartItem.vendorId}`)
        .where('PV.productId = :pid', { pid: cartItem.productId })
        .select(selects);
        return query.getRawOne();
    }

    public async getVendorListings(request: any, count?: any): Promise<any> {
        const { limit, offset, siteId, groupBy, status, keyword } = request.body;
        const user = request.user;
        const selects = [
            'VPV.vendorId as vendorId',
            'P.id as productId',
            'P.name as name',
            'VPV.price as price',
            'VPV.sku as sku',
            'VPV.available as available',
            'PV.productVariantValuesId as variantName',
            '(SELECT pvi.image FROM product_variant_images pvi WHERE pvi.product_variants_id = PV.id AND pvi.is_default = 1 LIMIT 1) as image',
            '(SELECT vpsl.product_status FROM vendor_product_status_logs vpsl WHERE vpsl.product_id = VPV.productId AND vpsl.vendor_id = VPV.vendorId ORDER BY id DESC LIMIT 1) as status',
            // 'VPSL.productStatus as status',
            // 'PV.productVariantValuesId as variantName',
            // 'PV.id as productVariantTblIdasd',
        ];
        const sort = [
            { name: 'P.id', order: 'DESC' },
        ];
        const query: any = await getConnection().getRepository(VendorProductVariants).createQueryBuilder('VPV');
        query.innerJoin(Product, 'P', 'VPV.productId = P.id');
        query.innerJoin(ProductVariants, 'PV', 'PV.id = VPV.productVariantId');
        // query.leftJoin(VendorProductStatusLog, 'VPSL', 'VPV.productId = VPSL.productId AND VPV.vendorId = VPSL.vendorId');
        query.select(selects);
        // query.innerJoin(VendorProductVariants, 'VPV', `VPV.productId = P.id AND VPV.vendorId = ${i.vendorId}`);
        query.where('VPV.siteId = :siteId AND VPV.vendorId = :vendorId', { siteId, vendorId: user.userId });
        if (keyword) {
            query.andWhere('P.name like ' +'\'%' +keyword+ '%\'');
        }
        if (status) {
            if (status === 'active') {
                query.andWhere('VPV.isActive = 1');
            }
            if (status === 'in-active') {
                query.andWhere('VPV.isActive = 0');
            }
            if (status === 'all') {}
        }
        if (groupBy) {
            if (groupBy === 'productId') {
                query.groupBy('P.id');
            }
        }
        if (sort && sort.length > 0) {
            sort.forEach((item: any) => {
                query.orderBy('' + item.name + '', '' + item.order + '');
            });
        }
        if (count) {
            return query.getCount();
        } else {
            if (limit && limit > 0) {
                query.limit(limit).offset(offset);
            }
            return query.getRawMany();
        }
    }

    public async getVariantImageById(id: number): Promise<any> {
        return await this.productVariantImagesService.findOne({ where: { productVariantsId: id }});
    }

    public async getProductRatingByProductId(productId: number): Promise<any> {
        const p: any = this.findOne(productId);
        const w = [
            { name: 'product_id', op: 'where', value: productId },
            { name: 'is_active', op: 'andWhere', value: 1 },
            { name: 'is_approved', op: 'andWhere', value: 1 }
        ];
        const totalReviews = await this.productRatingsService.listRatings(0, 0, 0, 0, w, false);
        for (let star = 1; star <= 5; star++) {
            if (star === 1) {
                p.OneStarRatingCount = totalReviews.filter(i => i.rating == star).length;
            }
            if (star === 2) {
                p.TwoStarRatingCount = totalReviews.filter(i => i.rating == star).length;
            }
            if (star === 3) {
                p.ThreeStarRatingCount = totalReviews.filter(i => i.rating == star).length;
            }
            if (star === 4) {
                p.FourStarRatingCount = totalReviews.filter(i => i.rating == star).length;
            }
            if (star === 5) {
                p.FiveStarRatingCount = totalReviews.filter(i => i.rating == star).length;
            }
        }
        p.reviewCount = totalReviews.length;
        const rating = this.productRatignCalculations(p);
        return rating;
    }

    public productRatignCalculations(product: any) {
        const p = product;
        const a = p.OneStarRatingCount;
        const b = p.TwoStarRatingCount;
        const c = p.ThreeStarRatingCount;
        const d = p.FourStarRatingCount;
        const e = p.FiveStarRatingCount;
        const x = [a, b, c, d, e];
        const stars = x.map((item, index) => {
            const check = Math.ceil((item / p.reviewCount) * 100);
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
        let avgRating: any = (q + w + r + t +y) / p.reviewCount;
        if (avgRating) {
            avgRating = parseFloat(avgRating).toFixed(1);
        } else {
            avgRating = '0'
        }
        return {
            stars,
            avgRating,
            reviewCount: p.reviewCount,
        }
    }

    public async getProdutDetails (id: any) {
        const selects = [
            'Product.id as productId',
            'Product.name as name',
            'PV.id as productVariantId',
            'PV.productVariantValuesId as variant',
            '(SELECT pvi.image FROM product_variant_images pvi WHERE pvi.product_variants_id = PV.id AND pvi.is_default = 1 LIMIT 1) as image',
        ];
        const query: any = await getConnection().getRepository(Product).createQueryBuilder('Product')
        .innerJoin(ProductVariants, 'PV', 'PV.productId = Product.id')
        .where('PV.productId = :id', { id: id })
        .select(selects);
        return query.getRawOne();
    }

    public async getTaxOnProductsForIndia(cartlist: any, request: any, couponAmount: string) {
        const userId = await this.authService.parseBasicAuthFromRequest(request);
        if (userId) {
            const checkuser = await this.authService.validateUser(userId, UserTypes.Buyer);
            if (checkuser) {
                request.user = checkuser;
            }
        }


        const selects = [
            'TaxClass.id as taxClassId',
            'TaxClass.name as name',
            'TaxClass.value as value',
            'TaxClass.isActive as isActive',
            'VPV.id as productId',
            'VPV.id as vendorProductVariantId',
            'VPV.productId as originalProductId',
            'VPV.vendorId as vendorId',
            'VPV.price as price',
            'VPV.price2 as price2',
            'VPV.productVariantId as productVariantId',
            'PD.price as discountPrice',
            'PD.price2 as discountPrice2',
            'PD.id as discountId',
            'PD.startDate as discountStartDate',
            'PD.endDate as discountEndDate',
            `(SELECT PSI.charges FROM product_shipping_info PSI WHERE PSI.product_id = VPV.productId AND PSI.vendor_id = VPV.vendorId AND PSI.type = Cart.selectedShippingOpt LIMIT 1) as shippingCharges`
        ];
        let PSI_ArrayString = '(0,0,0,0),';
        cartlist.forEach((e: any) => {
            PSI_ArrayString += `(${e.siteId},${e.vendorId},${e.productId},${e.productVariantId}),`
        });
        PSI_ArrayString += '(0,0,0,0)';
        let query: any = getConnection().getRepository(VendorProductVariants).createQueryBuilder('VPV')
        .innerJoin(VendorProduct, 'VendorProduct', 'VendorProduct.vendorId = VPV.vendorId AND VendorProduct.productId = VPV.productId')
        .leftJoin(TaxClass, 'TaxClass', 'TaxClass.id = VendorProduct.taxClassId AND TaxClass.isActive = 1')
        // .innerJoin(Cart, 'Cart', 'Cart.vendorId = VPV.vendorId AND Cart.productId = VPV.productId AND Cart.productVariantId = VPV.productVariantId')
        .innerJoin(
            Cart,
            'Cart',
            'Cart.vendorId = VPV.vendorId ' +
              'AND Cart.productId = VPV.productId ' +
              'AND Cart.productVariantId = VPV.productVariantId ' +
              'AND (Cart.deviceId = :deviceId OR Cart.userId = :userId)',
            { deviceId: request.user ? null : request.deviceId, userId: request.user ? request.user.userId : null }
        )
        .leftJoin(ProductDiscount, 'PD', 'PD.vendorProductVariantId = VPV.id AND NOW() >= PD.startDate AND NOW() <= PD.endDate')
        .where('(VPV.siteId, VPV.vendorId, VPV.productId, VPV.productVariantId) IN (' + PSI_ArrayString + ')');
        let cartlistProducts = await query.select(selects).getRawMany();
        // get the max/highest value of tax class from cartlist as per indian requirement and apply that value on shipping charges of all products
        let maxValue = cartlistProducts.reduce((max, obj) => {
            if (obj.value !== null && !isNaN(obj.value)) {
                const parsedValue = parseInt(obj.value);
                return parsedValue > max ? parsedValue : max;
            }
            return max;
        }, Number.NEGATIVE_INFINITY);
        console.log('maxValue ============================', maxValue);
        const itemWithHighestPrice = cartlistProducts.reduce((maxItem, currentItem) => {
            const currentPrice = parseFloat(currentItem.price);
            const maxPrice = parseFloat(maxItem.price);
            return currentPrice > maxPrice ? currentItem : maxItem;
        }, { price: '-Infinity' }); // Initialize with a default value
        // vendorProductVariantId
        cartlistProducts = cartlistProducts.map(i => {
            const obj = {
                ...i,
                quantity: 1,
                taxAmount: '0',
                shippingChargesTax: '0',
                itemGrandTotal: '0'
            }
            const qty = cartlist.find(c => c.productVariantId == i.productVariantId);
            if (qty) {
                obj.quantity = qty.quantity ? qty.quantity : 1;
            }
            const taxAmount = (parseFloat(i.price) - parseFloat(i.price2)).toFixed(2) as any * obj.quantity;
            obj.taxAmount = taxAmount;
            if (i.discountPrice) {
                const a = (parseFloat(i.discountPrice) - parseFloat(i.discountPrice2)).toFixed(2) as any * obj.quantity;
                obj.taxAmount = a;
            }
            if (i.taxClassId) {
                // As per Indian Team requirement maximum of 18% tax can be applied on shipping charges
                if (maxValue && Number(maxValue) > 18) {
                    maxValue = '18.00';
                }
                const p: any = parseFloat(i.shippingCharges).toFixed(2);
                const tv: any = parseFloat(maxValue).toFixed(2);
                const taxAmountOnShippingCharges = ((p * tv) / 100).toFixed(2);
                obj.shippingChargesTax = parseFloat(taxAmountOnShippingCharges) * obj.quantity;
                // if coupon has been applied
                if (couponAmount) {
                    // manage tax of highest price product price to display accurate tax amount on Ui however in customer-checkout it will be managed automatically
                    if (itemWithHighestPrice.vendorProductVariantId == i.vendorProductVariantId) {
                        const ca: any = parseFloat(couponAmount).toFixed(2);
                        const priceAfterDiscount = (parseFloat(i.discountPrice2 ? i.discountPrice2 : i.price2).toFixed(2) as any * obj.quantity) - ca;
                        obj.taxAmount = ((priceAfterDiscount * tv) / 100);
                    }
                }
            }
            obj.itemGrandTotal = (parseFloat(obj.shippingCharges) * obj.quantity) + parseFloat(obj.shippingChargesTax);
            if (i.discountPrice) {
                obj.itemGrandTotal = obj.itemGrandTotal + (parseFloat(i.discountPrice) * obj.quantity);
            } else {
                obj.itemGrandTotal = obj.itemGrandTotal + (parseFloat(i.price) * obj.quantity);
            }
            obj.itemGrandTotal = parseFloat(obj.itemGrandTotal).toFixed(2);
            return obj;
        });
        let totalTax = (parseFloat(sumBy(cartlistProducts, 'taxAmount').toString()).toFixed(2)).toString();
        let shippingChargesTax = (parseFloat(sumBy(cartlistProducts, 'shippingChargesTax').toString()).toFixed(2)).toString();
        let grandTotal = (cartlistProducts.reduce((total, item) => total + parseFloat(item.itemGrandTotal), 0)).toFixed(2);
        if (totalTax == '0.00') {
            totalTax = '0';
        }
        if (shippingChargesTax == '0.00') {
            shippingChargesTax = '0';
        }
        // calculate cart subtotal amount and send in json response to display on frontend
        // purpose: Subtotal amount will vary after coupon becuase tax will calculate after counpon amount
        const itemSubtotal = (cartlistProducts.reduce((total, item) => total + (parseFloat(item.discountPrice2 ? item.discountPrice2 : item.price2) * item.quantity), 0)).toFixed(2).toString();
        return {
            totalTax,
            shippingChargesTax,
            grandTotal,
            itemSubtotal,
            productsWithTaxInfo: cartlistProducts
        }
    }

    public async filterByVariants(query: any, variants: any) {
        const uniqueVariantIds = new Set();
        for (const variant of variants) {
          uniqueVariantIds.add(variant.variantId);
        }
        query.innerJoin(ProductVariantValue, 'PVV', 'P.id = PVV.productId');
        const hasDifferentVariantIds = uniqueVariantIds.size > 1;
        if (hasDifferentVariantIds) {
            const variantPairs = this.generateVariantPairs(variants);

            if (variantPairs.length > 0) {
                const conditionClauses = [];
                const parameters = {};

                for (let i = 0; i < variantPairs.length; i++) {
                const { variantId1, value1, variantId2, value2 } = variantPairs[i];
                const aliasPrefix = `pair${i + 1}`;
            
                conditionClauses.push(
                    `(PVV.variantId = :${aliasPrefix}variantId1 AND PVV.value = :${aliasPrefix}value1) AND ` +
                    `(EXISTS (SELECT 1 FROM product_variant_values PVV2 WHERE PVV2.product_id = P.id AND PVV2.variant_id = :${aliasPrefix}variantId2 AND PVV2.value = :${aliasPrefix}value2))`
                );
            
                parameters[`${aliasPrefix}variantId1`] = variantId1;
                parameters[`${aliasPrefix}value1`] = value1;
                parameters[`${aliasPrefix}variantId2`] = variantId2;
                parameters[`${aliasPrefix}value2`] = value2;
                }
                query.andWhere(`(${conditionClauses.join(' OR ')})`, parameters);
            }
        } else {
                const variantIds = variants.map((v: any) => v.variantId);
                const variantValues = variants.map((v: any) => v.value);

                query.andWhere('(PVV.variantId IN (:...variantIds) AND PVV.value IN (:...variantValues))', {
                    variantIds,
                    variantValues
                });
        }
    }

    public generateVariantPairs(variants: any) {
        const variantPairs = [];
        const variantId1Objects = variants.filter(v => v.variantId == 1);
        const variantId2Objects = variants.filter(v => v.variantId == 2);
      
        for (let i = 0; i < variantId1Objects.length; i++) {
          const variantId1 = variantId1Objects[i];
          
          for (let j = 0; j < variantId2Objects.length; j++) {
            const variantId2 = variantId2Objects[j];
            
            const pair = {
              variantId1: variantId1.variantId,
              value1: variantId1.value,
              variantId2: variantId2.variantId,
              value2: variantId2.value,
            };
      
            variantPairs.push(pair);
          }
        }
      
        return variantPairs;
    }

    public async getWarrantySettings(productDetails) {
        const selects = [
            'PW.id as id',
            'WT.type as type',
            'REPLACE(PW.period, "-", " ") as period',
            'PW.warrantyTypeId as warrantyTypeId'
        ];
    
        let query: any = await getConnection().getRepository(ProductWarranty)
            .createQueryBuilder('PW')
            .innerJoin(WarrantyTypes, 'WT', 'WT.id = PW.warrantyTypeId')
            .select(selects)
            .where('PW.vendorProductId = :vendorProductId', { vendorProductId: productDetails.vendorProductId })
            .setParameters({ vendorProductId: productDetails.vendorProductId })
            .getRawMany();

        query = query.map((item, index) => ({
            id: item.warrantyTypeId,
            type: item.warrantyTypeId === 4 ? index === 0 ? 'Seller Warranty' : 'Manufacturer Warranty' : item.type,
            period: item.period,
        }));
    
        return query;
    }
    
}
