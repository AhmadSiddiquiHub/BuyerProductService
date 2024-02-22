import 'reflect-metadata';
import { JsonController, Res, Req, QueryParam, Post, Body, Authorized, Get } from 'routing-controllers';
import mtz from 'moment-timezone';

import { ProductAnswersService } from '../services/ProductAnswersService';
import { ProductQuestionsService } from '../services/ProductQuestionsService';
import { ProductService } from '../services/ProductService';
import { CategoriesServices } from '../services/CategoriesService';
import { PluginService } from '../services/PluginService';
import { ProductRatingsService } from '../services/ProductRatingsService';
import { UserService } from '../services/UserServices';
import { ShippingRegionService } from '../services/ShippingRegionService';
import { FunctionService } from '../services/FunctionService';
import { ProductVariantValueService } from '../services/ProductVariantValueService';
import { CourierService } from '../services/CourierService';
import { ProductVariantsService } from '../services/ProductVariantsService';
import { VendorProductVariantsService } from '../services/VendorProductVariantsService';
import { ProductVariantImagesService } from '../services/ProductVariantImagesService';
import { getConnection, getManager, getRepository, In } from 'typeorm';
import { RelatedProductListingRequest, ProductReviewsListingRequest, CreateQuestion, sameDayOptionsRequest } from './requests';
import axios from 'axios';
import { GetQuestionListRequest } from './requests/buyer';
import { VendorStoreProfileService } from '../services/VendorStoreProfileService'
import { UserBrowsingHistory } from '../models/UserBrowsingHistory';
import { UserBrowsingHistoryService } from '../services/UserBrowsingHistoryService';
import { UserWishlistService } from '../services/UserWishlistService';
import { BrandsService } from '../services/BrandsService';
import { SubOrderService } from '../services/SubOrderService';
import { IsNotEmpty, IsIn, ValidateIf } from 'class-validator';
import { orderBy } from 'lodash';
import { ProductQuestions } from '../models/ProductQuestions';
import { VendorProductService } from "../services/VendorProductService";
import { SiteSettingsService } from "../services/SiteSettingsService";
import { EmailService } from "../services/EmailsService";
import { decryptTokenWithSecret, formatPrice, getRegion } from '../utils';
import { SiteCategoriesService } from '../services/SiteCategoriesService';
import { SitePageMlService } from '../services/SitePageMlService';
import { CampaignService } from '../services/CampaignService';
import { VendorService } from '../services/VendorService';
import { ShipmentService } from '../services/ShipmentService';
import { UserAddresses } from '../models/UserAddresses';
// import { OpenBoxGlobalPincodeService } from '../services/OpenBoxGlobalPincodeService';
// import { OpenBoxProductPincodeService } from '../services/OpenBoxProductPincodeService';
// import { OpenBoxSubscriptionService } from '../services/OpenBoxSubscriptionService';
import { ProductShippingInfoService } from '../services/ProductShippingInfoService';
import { SameDayGlobalPincodesService } from '../services/SameDayGlobalPincodesService';
import { SameDayProductPincodesService } from '../services/SameDayProductPincodeService';
import { Sites } from '../models/Sites';

export class ProductListingRequest {

    @IsNotEmpty({ message: 'limit is required in body' })
    public limit: number;

    @IsNotEmpty({ message: 'offset is required in body' })
    public offset: number;

    @IsIn(['all', 'byCategory', 'byBrand', 'byVendor', 'FP', 'OSP', 'TDP', 'TRP', 'TSP', 'byCampaign'])
    public ptype: string;

    @IsNotEmpty()
    @ValidateIf(n => n.ptype === 'byCategory' || n.ptype === 'byBrand' || n.ptype === 'byVendor')
    public slug: string;
}
export class SeatchProductsRequest {
    // @IsNotEmpty({ message: 'keyword is required in body' })
    public keyword: string;

    public categoryId: number;
}

@JsonController()
export class ProductController {
    constructor(
        private productAnswersService: ProductAnswersService,
        private productQuestionsService: ProductQuestionsService,
        private productService: ProductService,
        private categoriesService: CategoriesServices,
        private pluginService: PluginService,
        private productRatingsService: ProductRatingsService,
        private regionService: ShippingRegionService,
        private functionService: FunctionService,
        private productVariantValueService: ProductVariantValueService,
        private courierService: CourierService,
        private productVariantsService: ProductVariantsService,
        private vendorProductVariantsService: VendorProductVariantsService,
        private productVariantImagesService: ProductVariantImagesService,
        private vendorStoreProfileService: VendorStoreProfileService,
        private userBrowsingHistoryService: UserBrowsingHistoryService,
        private userService: UserService,
        private userWishlistService: UserWishlistService,
        private brandsService: BrandsService,
        private subOrderService: SubOrderService,
        private vendorProductService: VendorProductService,
        private siteSettingsService: SiteSettingsService,
        private emailsService: EmailService,
        private siteCategoriesService: SiteCategoriesService,
        private sitePageMlService: SitePageMlService,
        private campaignService: CampaignService,
        private vendorService: VendorService,
        private shipmentService: ShipmentService,
        private sameDayGlobalPincodeService: SameDayGlobalPincodesService,
        private sameDayProductPincodeService: SameDayProductPincodesService,
        // private openBoxGlobalPincodeService: OpenBoxGlobalPincodeService,
        //private openBoxProductPincodeService: OpenBoxProductPincodeService,
        private productShippingInfoService: ProductShippingInfoService,
        // private openBoxSubscriptionService: OpenBoxSubscriptionService,

    ) { }
    public getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    // /api/buyer/products/test-feed.xml
    @Get('/test-feed.xml')
    public async testFeedData(@Req() request: any, @Res() response: any): Promise<any> {
        const limit = request.query.limit;
        const offset = request.query.offset;
        
        const products = await this.productService.getXML(limit, offset);



        // UPDATE products AS p
        // JOIN (
        //     SELECT 
        //         p.id AS product_id,
        //         CONCAT('<item><id>', vpv.sku ,'</id><title>', p.name ,'</title><description>This is an example RSS feed.</description><availability>', vpv.available ,'</availability><price>', vpv.price ,'</price><link>https://qa.cybermart.pk/Testing-identical-variant-names-CM920004959</link><image_link>https://media.cybermart.pk/devtesting/Img_1702904412173.png</image_link><brand>', b.name ,'</brand></item>') AS updated_xml
        //     FROM 
        //         products p
        //     JOIN 
        //         vendor_product_variants vpv ON p.id = vpv.product_id
        //     JOIN 
        //         vendor_products vp ON vpv.vendor_id = vp.id
        //     JOIN 
        //         brands b ON vp.brand_id = b.id
        // ) AS joined_data ON p.id = joined_data.product_id
        // SET p.xml = joined_data.updated_xml;




        // UPDATE products AS p
        // JOIN (
        //     SELECT
        //         p.id AS product_id,
        //         CONCAT('<item><id>', vpv.sku ,'</id><title>', p.name ,'</title><description>This is an example RSS feed.</description><availability> in stock </availability><condition>new</condition><price>', vpv.price ,'</price><link>https://qa.cybermart.pk/Testing-identical-variant-names-CM920004959</link><image_link>https://media.cybermart.pk/devtesting/Img_1702904412173.png</image_link><brand>', b.name ,'</brand></item>') AS updated_xml
        //     FROM
        //         products p
        //     JOIN
        //         vendor_product_variants vpv ON p.id = vpv.product_id
        //     JOIN
        //         vendor_products vp ON vpv.vendor_id = vp.id
        //     JOIN
        //         brands b ON vp.brand_id = b.id
        // ) AS joined_data ON p.id = joined_data.product_id
        // SET p.xml = joined_data.updated_xml;


        
        // const entityManager = getManager();
        // const queryResult = await entityManager.query('CALL GenerateRSSFeed();');
        


        // const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
        // <rss version="2.0">
        //     <channel>
        //         <title>Example RSS Feed</title>
        //         <link>http://www.example.com</link>
        //         <description>This is an example RSS feed.</description>
        //         <language>en-us</language>
        //         <lastBuildDate>Wed, 21 Dec 2023 00:00:00 GMT</lastBuildDate>
        //         <item>
        //             <id>CM-123</id>
        //             <title>Product 1</title>
        //             <description>This is an example RSS feed.</description>
        //             <availability>in stock</availability>
        //             <condition>new</condition>
        //             <price>9.99 USD</price>
        //             <link>https://qa.cybermart.pk/Testing-identical-variant-names-CM920004959</link>
        //             <image_link>https://media.cybermart.pk/devtesting/Img_1702904412173.png</image_link>
        //             <brand>Levis</brand>
        //         </item>
        //     </channel>
        // </rss>`;
        const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
        <rss version="2.0">
            <channel>
                <title>Example RSS Feed</title>
                <link>http://www.example.com</link>
                <description>This is an example RSS feed.</description>
                <language>en-us</language>
                <lastBuildDate>Wed, 21 Dec 2023 00:00:00 GMT</lastBuildDate>
                ${products}
            </channel>
        </rss>`;
        

        response.set('Content-Type', 'application/rss+xml');
        
        // Send the XML data as the response
        return response.send(xmlData);
    }

    // /api/buyer/products/wishlist-product-list
    @Post('/wishlist-product-list')
    @Authorized('customer')
    public async wishlistProductlist(@Req() request: any, @Res() response: any): Promise<any> {
        console.log(request.user.userId)
        let totalProducts = await this.productService.userWishListProducts(request,1);
        const totalProductsCount = totalProducts.length;
        totalProducts = totalProducts.length / request.body.limit;
        totalProducts = Math.ceil(totalProducts);
        let productList = await this.productService.userWishListProducts(request,0);
        // request.body.outOfStock = true
        productList = await this.productService.productListing_ResponseStructure(productList, request);
        console.log(productList)
        const wishListItems = await this.userWishlistService.find({ where: { userId: request.user.userId, siteId: request.siteId } });
        const successResponse: any = {
            status: 1,
            message: 'list',
            wishListCount: wishListItems.length,
            pLength: productList.length,
            pages: totalProducts,
            totalProductsCount,
            data: productList,
        };

        return response.status(200).send(successResponse);
    }

    // /api/buyer/products/answer-list
    @Post('/answer-list')
    public async answerList(@QueryParam('limit') limit: number, @QueryParam('offset') offset: number, @QueryParam('keyword') keyword: string, @QueryParam('questionId') questionId: number, @QueryParam('count') count: number | boolean, @Req() request: any, @Res() response: any): Promise<any> {
        // const question = await this.productQuestionsService.findOne({
        //     where: { questionId },
        // });
        // if (!question) {
        //     const errorResponse: any = {
        //         status: 1,
        //         message: 'Invalid QuestionId',
        //     };
        //     return response.status(400).send(errorResponse);
        // }
        const select = ['id', 'productQuestionId', 'answer', 'userType', 'createdAt', 'isActive'];
        const whereConditions = [];
        const search: any = [
            // {
            //     name: 'questionId',
            //     op: 'where',
            //     value: questionId,
            // },
            // {
            //     name: 'isActive',
            //     op: 'where',
            //     value: 1,
            // },
            // {
            //     name: 'answer',
            //     op: 'like',
            //     value: keyword,
            // },
        ];

        const answerList = await this.productAnswersService.list(limit, offset, select, search, whereConditions, count);
        if (count) {
            return response.status(200).send({
                status: 1,
                message: 'Successfully get count',
                data: answerList,
            });
        }
        // const promise = answerList.map(async (result: any) => {
        //     const type = result.type;
        //     const temp: any = result;
        //     if (type && type === 2) {
        //         const customer = await this.customerService.findOne({
        //             select: ['id', 'firstName', 'avatar', 'avatarPath', 'city'],
        //             where: { id: result.referenceId },
        //         });
        //         if (customer !== undefined) {
        //             temp.postedBy = customer;
        //         }
        //     } else if (type && type === 1) {
        //         const adminUser = await this.userService.findOne({
        //             select: ['userId', 'firstName', 'avatar', 'avatarPath'],
        //             where: { userId: result.referenceId },
        //         });
        //         if (adminUser !== undefined) {
        //             temp.postedBy = adminUser;
        //         }
        //     }
        //     if (request.header('authorization')) {
        //         const encryptString = request.header('authorization').split(' ')[1];
        //         const Crypto  = require('crypto-js');
        //         const bytes  = Crypto.AES.decrypt(encryptString, env.cryptoSecret);
        //         const originalEncryptedString = bytes.toString(Crypto.enc.Utf8);
        //         const userId = jwt.verify(originalEncryptedString, env.jwtSecret, { ignoreExpiration: true });
        //         const userUniqueId: any = Object.keys(userId).map((key: any) => {
        //             return [(key), userId[key]];
        //         });
        //         const likeType = await this.productAnswerLikeService.findOne({
        //             where: {
        //                 answerId: result.answerId,
        //                 customerId: userUniqueId[0][1],
        //             },
        //         });
        //         if (likeType) {
        //             temp.likeType = likeType.type;
        //         } else {
        //             temp.likeType = 0;
        //         }
        //     } else {
        //         temp.likeType = 0;
        //     }
        //     return temp;
        // });
        // const value = await Promise.all(promise);
        const successResponse: any = {
            status: 1,
            message: 'Successfully get all answer List',
            data: answerList, // value,
        };
        return response.status(200).send(successResponse);

    }

    // /api/buyer/products/add-question
    @Post('/add-question')
    @Authorized('customer')
    public async createQuestion(@Body({ validate: true }) questionParam: CreateQuestion, @Req() request: any, @Res() response: any): Promise<any> {
        const limit = 100;
        const offset = 0;
        const siteId = request.siteId;
        const keyword = '';
        const vendorDetail = await this.vendorProductService.findOne({ where: { slug: questionParam.productSlug } });
        if (!vendorDetail) {
            return response.status(400).send({ status: 1, message: 'Invalid request' });
        }
        const productDetail = await this.productService.findOne({ where: { id: vendorDetail.productId } });
        if (!productDetail) {
            return response.status(400).send({ status: 1, message: 'Invalid request' });
        }
        const question = new ProductQuestions();
        question.question_ = questionParam.question.replace(/[\u0800-\uFFFF]/g, '');
        question.productId = productDetail.id;
        question.siteId = request.siteId;
        question.userId = request.user.userId;
        question.vendorId = vendorDetail.vendorId;
        const { value } = await this.siteSettingsService.findOne({ where: { keyName: 'Product_Question_Approval' } });
        if (value && Number(value) === 1) {
            question.isActive = 1;
            question.isApproved = 1;
        }
        const questionSaved = await this.productQuestionsService.create(question);
        if (value && Number(value) === 0) {
            await this.emailsService.sendEmailToAdminForApprovedQuestion(request.siteId, request.user, productDetail.id, questionSaved.question_);
        }
        console.log("productDetail", productDetail);
        const { qaList, count } = await this.productQuestionsService.qaList({ limit, offset, siteId, productId: productDetail.id, keyword, count: true });
        console.log('data : count', qaList, "count:", count);

        const pages = Math.ceil(count / limit);
        const successResponse: any = { status: 1, message: 'Question Posted Successfully', data: questionSaved, qaList, pages };
        return response.status(200).send(successResponse);
    }

    // /api/buyer/products/question-list
    @Post('/question-list')
    public async questionList(@Body({ validate: true }) params: GetQuestionListRequest, @Req() request: any, @Res() response: any): Promise<any> {
        const limit = params.limit;
        const offset = params.offset;
        const siteId = request.siteId;
        const productSlug = params.slug;
        const keyword = params.keyword;
        console.log(request.body, request.siteId);
        const productDetails = await this.productService.productDetails({ slug: productSlug, siteId });
        if (!productDetails) {
            return response.status(400).send({ status: 0, message: 'Invalid slug', data: {} });
        }
        const { qaList, count } = await this.productQuestionsService.qaList({ limit, offset, siteId, productId: productDetails.productId, keyword, count: true });
        console.log('data : count', qaList, "count:", count);

        const pages = Math.ceil(count / limit);
        return response.status(200).send({
            status: 1,
            message: 'Product questions list',
            pages,
            data: qaList
        });
    }

    // /api/buyer/products/search-products-suggestions
    @Post('/search-products-suggestions')
    public async searchProductsSuggestions(@Body({ validate: true }) params: SeatchProductsRequest, @Req() request: any, @Res() response: any): Promise<any> {
        if (params.keyword === '') {
            return response.status(200).send({ status: 1, message: 'keyword cannot be empty', data: { suggestions: [] } });

        }
        const suggestions = await this.productService.searchProductsSuggestions(request.siteId, params.keyword, params.categoryId);
        return response.status(200).send({ status: 1, message: 'Suggestions', data: { suggestions } });
    }

    // /api/buyer/products/product-listing
    @Post('/product-listing')
    public async productListing(@Body({ validate: true }) params: ProductListingRequest, @Req() request: any, @Res() response: any): Promise<any> {
        // let p = await this.productService.listing(request);
        // return response.status(200).send({ products: p });
        // const whereConditions = [
        //     { name: 'ProductRating.vendorId ', op: 'where', value: vendorId },
        //     { name: 'ProductRating.siteId', op: 'andWhere', value: siteId },
        // ];
        // let review: any = await this.productRatingsService.listByQueryBuilder(limit, offset, selects, whereConditions, r);
        // if (whereConditions && whereConditions.length > 0) {
        //     whereConditions.forEach((item: any) => {
        //         if (item.op === 'where' ) {
        //             query.where(item.name + ' = ' + item.value);
        //         } else if (item.op === 'andWhere') {
        //             query.andWhere(item.name + ' = ' + item.value);
        //         } else if (item.op === 'and' && item.sign !== undefined) {
        //             query.andWhere(' \'' + item.name + '\'' + ' ' + item.sign + ' \'' + item.value + '\'');
        //         } else if (item.op === 'raw' && item.sign !== undefined) {
        //             query.andWhere(item.name + ' ' + item.sign + ' \'' + item.value + '\'');
        //         } else if (item.op === 'or' && item.sign === undefined) {
        //             query.orWhere(item.name + ' = ' + item.value);
        //         } else if (item.op === 'IN' && item.sign === undefined) {
        //             query.andWhere(item.name + ' IN (' + item.value + ')');
        //         } else if (item.op === 'NOT' && item.sign === undefined) {
        //             query.andWhere('NOT (' + 'ISNULL (' + item.name + ')' + ')');
        //         }
        //     });
        // }
        if (params.ptype === 'byCampaign') {
            const campaign = await this.campaignService.activeCampaign(params.slug);
            if (!campaign) {
                return response.status(400).send({ status: 0, message: 'Invalid Slug!', data: {} });
            }
            request.body.campaignId = campaign.id;
        }
        if (params.ptype === 'byVendor') {
            const store = await this.vendorStoreProfileService.findOne({ where: { slug: params.slug } });
            if (!store) {
                return response.status(404).send({ status: 0, message: '', data: {} });
            }
            request.body.vendorId = store.userId;
        }
        if (params.ptype === 'byBrand') {
            const brand = await this.brandsService.findOneBySlug(params.slug, request.siteId);
            if (!brand) {
                return response.status(400).send({ status: 0, message: 'Invalid brand slug', data: {} });
            }
            request.body.brandId = brand.id;
        }
        let category: any;
        if (params.ptype === 'byCategory') {
            category = await this.categoriesService.categoryDetailsBySlug(request.siteId, 1, params.slug);
            if (!category) {
                return response.status(400).send({ status: 0, message: 'Invalid category slug', data: {} });
            }
            // request.body.categoryId = category.catId;
            const allChildren = await this.categoriesService.getAllChildrenOfCategory(category.catId);
            request.body.categoryId = allChildren;
            console.log('request.body.categoryId', request.body.categoryId);
        }
        const sitesettings = await this.siteSettingsService.findOne({ where: { siteId: request.siteId, keyName: "hide_out_of_stock_products" } });
        if(sitesettings && sitesettings.value == 1){
            request.body.outOfStock = true;
        }
        const isUserLoggedIn = await this.functionService.isUserLoggedIn(request);
        if (isUserLoggedIn) {
            request.user = {
                userId: isUserLoggedIn,
            };
        }
        request.body.count = 0;
        let productList: any = await this.productService.listing(request);
        
        // 'C.description as categoryDescription',
        // 'ProductShippingInfo.type as ProductFreeShipping',
        productList = productList.map(i => {
            return {
                ...i,
                pricerefer: i.pricerefer ? i.pricerefer.toString() : '',
                productDiscountId: i.productDiscountId ? i.productDiscountId : 0,
                discountPercentage: i.discountPercentage ? i.discountPercentage : '',
                navigate_to: 'product_details_screen',
                ordersInLast24Hours: '',
                soldCount: 0,
                tag: '',
                cronJobType: '',
                ProductFreeShipping: i.ProductFreeShipping ? i.ProductFreeShipping : '',
                category: i.brandName,
                categoryDescription: 'CyberMart',
                vendorStoreName: 'vendorStoreName',
                vendorStoreSlug: 'vendorStoreSlug',
                sectionProduct_id: null,
                sectionProduct_is_active: null,
                sectionProduct_product_id: null,
                sectionProduct_section_id: null,
                sectionProduct_sort_order: 0
            };
        });
        // productList = await this.productService.productListing_ResponseStructure(productList, request);
        request.body.count = 1;
        let totalProducts = await this.productService.listing(request);
        const totalProductsCount = totalProducts.length;
        totalProducts = totalProductsCount / request.body.limit;
        totalProducts = Math.ceil(totalProducts);
        let successResponse: any = {
            status: 1,
            message: 'listing',
            length: productList.length,
            pages: totalProducts,
            totalProductsCount,
            data: productList,
        };
        if (params.ptype === 'byCategory') {
            successResponse.category = category
        }
        return response.status(200).send(successResponse);
    }

    // /api/buyer/products/related-product-list
    @Post('/related-product-list')
    public async relatedProductList(@Body({ validate: true }) params: RelatedProductListingRequest, @Req() request: any, @Res() response: any): Promise<any> {
        const isUserLoggedIn = await this.functionService.isUserLoggedIn(request);
        if (isUserLoggedIn) {
            request.user = {
                userId: isUserLoggedIn,
            };
        }
        request.isRelatedProducts = true;
        request.body.slug = params.slug;
        let productList: any = await this.productService.relatedProductListing(request);
        productList = await this.productService.productListing_ResponseStructure(productList, request);
        const successResponse: any = {
            status: 1,
            message: 'Successfully got the complete list of products.',
            length: productList.length,
            data: productList,
        };
        return response.status(200).send(successResponse);
    }


    // /api/buyer/products/productdetail/:productslug
    @Post('/productdetail/:slug')
    public async productDetails(@Req() request: any, @Res() response: any): Promise<any> {
        const productslug = request.params.slug;
        const siteId = request.siteId;
        const sellerView = request.query.sellerView;
        // Allow seller to preview product details while product is in pending tab. sellerViewToken is being used in SellerProductService and BuyerProductService
        let allowSellerPreviewDetails = 0;
        if (sellerView) {
            const vendorId = await decryptTokenWithSecret(sellerView, 'sellerViewToken');
            if (!vendorId) {
                return response.status(404).send({ status: 0, message: 'Invalid sellerViewToken' });
            }
            const checkVendor = await this.userService.findOne({ where: { userId: vendorId, typeId: 'S' } });
            if (!checkVendor) {
                return response.status(404).send({ status: 0, message: 'Invalid vendor...' });
            }
            allowSellerPreviewDetails = 1;
        }
        const p: any = await this.productService.productDetails({ slug: productslug, siteId, sellerView });
        if (!p) {
            return response.status(404).send({ status: 0, message: 'Invalid product', data: p });
        }
        if (!p.productId || !p.productId == null) {
            return response.status(404).send({ status: 0, message: 'Invalid product', data: p });
        }
        const categoryPath = await this.categoriesService.getCompleteCategoryPathByVendorProductId(p.vendorProductId);
        const positive_feedback = await this.vendorService.findOne({ where: { userId: p.vendorId } })
        const questionAnswers = await this.productQuestionsService.qaList({ limit: 15, offset: 0, siteId, productId: p.productId, keyword: "", count: false });
        const shippingCharges = await this.productService.getProductShippingDetails(p.productId, p.siteId);
        const ratingList = await this.productRatingsService.prodcutRatingListing({ limit: 15, offset: 0, productId: p.productId, siteId, count: false });
        const productRating = await this.productService.getProductRatingByProductId(p.productId);
        const wishListItems = await this.userWishlistService.find({ where: { productId: p.productId, } });
        const totalSubOrderCountForThisProduct = await this.subOrderService.findAll({ where: { productId: p.productId } });
        const { value } = await this.siteSettingsService.findOne({ where: { keyName: 'showOrderCount' } });
        const returnDays = p.returnDays || '';
        const productsCount = await this.vendorStoreProfileService.vendorActiveProducts(p.vendorStoreSlug);
        const showSizeChart = await this.categoriesService.findOne({where: {id: categoryPath[categoryPath.length - 1].catId }})
        const selectDefaultVariant = await this.siteSettingsService.findOne({ where: { siteId: request.siteId, keyName: 'selectDefaultVariant' } });
        const warrantySettings = await this.productService.getWarrantySettings(p)
        const minimumCartValue = await this.siteSettingsService.findOne({ where: { keyName: 'minimumCartValue' } });
        const obj: any = {
            sellerView: allowSellerPreviewDetails,
            categoryPath: categoryPath.map(i => {
                return {
                    ...i,
                    productName: p.name
                };
            }),
            metaInfo: {
                title: p.metaTitle,
                keyword: p.metaKeyword,
                description: p.metaDescription,
            },
            selectDefaultVariant: selectDefaultVariant.value,
            sizeChartImage: showSizeChart.sizeChartImageRequired && p.sizeChartImage ? p.sizeChartImage : '',
            taxClassId: p.taxClassId,
            taxValue: p.taxValue,
            taxClassName: p.taxClassName,
            statusId: p.statusId,
            currencySymbol: request.currencySymbol,
            stars: productRating.stars,
            globalRating: productRating.reviewCount,
            avgRating: productRating.avgRating,
            positive_feedback: positive_feedback.avgRating,
            reviewCount: productRating.reviewCount, //rating.reviewCount,
            itemsSold: productsCount.productsCount.toString(),
            productsCount: productsCount.productsCount.toString(),
            sales: p.sales,
            productId: p.productId,
            name: p.name,
            slug: p.slug,
            vendorId: p.vendorId,
            totalWishListCount: wishListItems.length,
            totalOrderCount: value && Number(value) == 1 ? ((parseFloat(totalSubOrderCountForThisProduct.length)) + (p.fakeOrders ? parseFloat(p.fakeOrders): 0)) : null,
            fakeOrders: p.fakeOrders,
            totalSubOrderCountForThisProduct: totalSubOrderCountForThisProduct.length,
            // vendorName: p.firstName + ' ' + p.lastName,
            vendorStoreName: p.vendorStoreName,
            vendorStoreSlug: p.vendorStoreSlug,
            // tag: p.vendorStoreName == "CyberMart" ? "Accomplished by Cybermart" : " ",
            tag: "",
            brand: p.brand,
            isBrandActive: p.isBrandActive,
            siteId: p.siteId,
            COD: p.COD,
            bulkQuote: p.bulkQuote,
            returnDays: p.returnDays,
            wishListStatus: 0,
            comboOffer: [],
            bulletPoints: p.bulletPoints ? JSON.parse(p.bulletPoints) : [],
            shippingCharges,
            warrantyPeriod: { active: 1, id: 1, period: `${returnDays !== '' ? `${returnDays} days` : ''}` },
            warrantyType: { active: 1, id: 1, type: `${returnDays !== '' ? 'Brand Warranty' : 'No Return'}` },
            warrantySettings,
            longDesc: p.longDesc,
            shortDesc: p.shortDesc,
            moreInformation: p.moreInformation,
            questionAnswers: questionAnswers.qaList,
            reviewsList: ratingList,
            comboOfferProductsdata: [],
            showFakeRatingModule: 0
        };
        const isUserLoggedIn = await this.functionService.isUserLoggedIn(request);
        if (isUserLoggedIn) {
            const user = await this.userService.findOne({ where: { userId: isUserLoggedIn } });
            if (user) {
                if (user.saveBrowsHist == 1) {
                    const userBrowsingHistory = new UserBrowsingHistory();
                    userBrowsingHistory.userId = isUserLoggedIn;
                    userBrowsingHistory.productId = p.productId;
                    await this.userBrowsingHistoryService.create(userBrowsingHistory);
                }
                const a = await this.userWishlistService.findOne({ where: { userId: isUserLoggedIn, productId: p.productId, siteId: p.siteId } });
                if (a) {
                    obj.wishListStatus = 1;
                }
                const accessFakeReviewModule = await this.siteSettingsService.findOne({ where: { keyName: 'accessFakeReviewModule' } });
                if (accessFakeReviewModule) {
                    if (accessFakeReviewModule.value) {
                        const allUsers = accessFakeReviewModule.value.split(',');
                        if (allUsers.find(i => i == user.email)) {
                            obj.showFakeRatingModule = 1;
                        }
                    }
                }
            }
        }
        obj.comboOfferProductsdata = [];
        let productvariantList: any = await this.vendorProductVariantsService.getAllVendorVariants(p.vendorId, p.productId);
        // sorting ASC by discount price if exists
        // productvariantList = productvariantList.sort((a, b) => {
        //     a = a.variantDiscountPrice ? parseFloat(a.variantDiscountPrice) : 1000000000;
        //     b = b.variantDiscountPrice ? parseFloat(b.variantDiscountPrice) : 1000000000;
        //     return a - b;
        // });
        // create array of productVariantId to get images of all variants in one query
        const productVariantIds = productvariantList.map(v => v.productVariantId);
        let allImages = await this.productVariantImagesService.find({ where: { productVariantsId: In(productVariantIds) } });
        productvariantList = productvariantList.map(variant => {
            let images = allImages.filter(image => image.productVariantsId == variant.productVariantId);
            for (const image of images) {
                if (image.imageAlt == null) {
                    image.imageAlt = p.name;
                }
            }
            images = orderBy(images, ['isDefault'], ['desc']);
            const a = JSON.parse(variant.productVariantValuesId);
            const variantValueString = a.map((x, y) => x.value).join(',');
            const reverseVariantValueString = a.reverse().map((x, y) => x.value).join(',');
            // if there is any tax value
            // if (p.taxValue) {
            //     variant.price = parseFloat(variant.price) + (parseFloat(variant.price) * parseFloat(p.taxValue) / 100);
            //     variant.variantDiscountPrice = parseFloat(variant.variantDiscountPrice) + (parseFloat(variant.variantDiscountPrice) * parseFloat(p.taxValue) / 100);
            // }
            const variantObj: any = {
                vendorProductVariantId: variant.vendorProductVariantId,
                price: formatPrice(siteId, variant.price),
                pricerefer: variant.variantDiscountPrice ? formatPrice(siteId, variant.variantDiscountPrice) : '',
                productDiscountId: variant.variantDiscountId ? variant.variantDiscountId : 0,
                productVariantId: variant.productVariantId,
                vendorId: variant.vendorId,
                productId: variant.productId,
                variantValue: variantValueString,
                reverseVariantValueString,
                variant: variant.productVariantValuesId,
                outOfStock: variant.outOfStock,
                available: variant.available,
                statusId: variant.statusId,
                vpvIsActive: variant.isActive,
                pvIsActive: variant.pvIsActive,
                images,
                availableQuantity: variant.varaintQuantity,
                isDefaultVariant: variant.is_default
            };
            const dp: any = ((parseFloat(variant.price) - parseFloat(variant.variantDiscountPrice)) / parseFloat(variant.price)) * 100;
            variantObj.discountPercentage = parseInt(dp).toString();
            return variantObj;
        });
        obj.productvariantList = productvariantList;
        const hideOutOfStockConf = await this.siteSettingsService.findOne({ where: { keyName: 'hide_out_of_stock_products' } });
        // if (hideOutOfStockConf.value == 0) {
        //     const checkPVList = obj.productvariantList.filter(i => i.outOfStock === 0);
        //     if (checkPVList.length !== 0) {
        //         obj.productvariantList = checkPVList;
        //     }
        // }
        obj.minimumCartValue = minimumCartValue ? minimumCartValue.value : 0;
        const variants = await this.variantsV2(p.productId, obj.productvariantList);
        obj.variants = variants;
        if (hideOutOfStockConf.value == 1) {
            // obj.variants = this.hideVariants(obj.productvariantList, obj.variants);
            // below if check is due to handling of out of stock variants in case of only 1 combination
            if (obj.productvariantList.length > 1) {
                obj.variants = this.hideCombinationFromProductVariantList(obj.productvariantList, obj.variants);
            }
            const allValuesEmpty = obj.variants.every(v => v.values.length === 0);
            if (allValuesEmpty) {
                obj.variants = variants;
            }
            // if (obj.variants.length === 0) {
            //     obj.variants = variants;
            // }
        }
        // fixing this issue https://cybermartnode.atlassian.net/browse/CNJ-1679
        const inputArray = obj.variants;
        function generateCombinations(inputArray, currentIndex = 0, currentCombination = '') {
            if (currentIndex === inputArray.length) {
                // If reached the last property, push the combination to the result array
                resultArray.push(currentCombination);
                return;
            }
        
            const currentProperty = inputArray[currentIndex];
        
            // Iterate through the values of the current property
            currentProperty.values.forEach(valueObj => {
                // Recursively call the function for the next property
                generateCombinations(
                    inputArray,
                    currentIndex + 1,
                    currentCombination + (currentCombination ? ',' : '') + valueObj.value
                );
            });
        }
        
        const resultArray = [];
        generateCombinations(inputArray);
        obj.productvariantList = obj.productvariantList.map(i => {
            const o = {
                ...i,
                isDefaultVariant: 0
            };
            const a = resultArray.find(l => l == o.variantValue);
            if (a) {
                o.variantValue = a;
            }
            const b = resultArray.find(l => l == o.reverseVariantValueString);
            if (b) {
                o.variantValue = b;
            }
            return o;
        });
        obj.resultArray = resultArray;
        obj.productvariantList = orderBy(obj.productvariantList, ['vendorProductVariantId'], ['asc']);
        const a = obj.productvariantList.find(i => i.outOfStock == 0);
        if(a) {
            obj.productvariantList = obj.productvariantList.map(i => {
                return {
                    ...i,
                    isDefaultVariant: i.vendorProductVariantId == a.vendorProductVariantId ? 1 : 0
                }
            });
        } else {
            obj.productvariantList = obj.productvariantList.map((i, index) => {
                return {
                    ...i,
                    isDefaultVariant: index == 0 ? 1 : 0
                }
            });
        }
        // defaultVariantIssue
        return response.status(200).send({ status: 1, message: '', data: obj });
    }

    // private hideVariants(productvariantList: any, variants: any): Promise<any> {
    //     const testVars = variants;
    //     const arr = [];
    //     productvariantList.forEach(i => {
    //         arr.push(...i.variantValue.split(','))
    //     });
    //     const asd = testVars.map(i => {
    //         const xy = i.values.map(a => {
    //             const obj = {
    //                 ...a,
    //                 filter: 0
    //             }
    //             if (!arr.find(ar => ar == obj.value)) {
    //                 obj.filter = 1;
    //             }
    //             return obj;
    //         }).filter(f => f.filter === 0);
    //         return {
    //             ...i,
    //             values: xy
    //         }
    //     });
    //     for (let index = 0; index < asd.length; index++) {
    //         const element = asd[index];
    //         console.log(element.values)
    //     }
    //     // adasdcasd
    //     return asd;
    // }

    private hideCombinationFromProductVariantList(productvariantList: any, variants: any) {
        return variants.map(i => {
            const values = i.values.map(ii => {
                let select = ii.value;
                if (productvariantList.find(x => x.variantValue.split(',').includes(select) == true && x.outOfStock == 0)) {
                    return ii;
                } else {
                    return null;
                }
            }).filter(o => o !== null);
            return {
                ...i,
                values
            }
        });
    }

    public async getVariantImages(variant: any): Promise<any> {
        const a = await this.productVariantImagesService.find({ where: { productVariantsId: variant.id }, order: { isDefault: 'DESC' } });
        const b = a.map((x, y) => {
            return { image: x.image, isDefault: x.isDefault };
        });
        return b;
    }

    public async variantsV2(productId: number, productvariantList: any): Promise<any> {
        if (!productvariantList.length) {
            return [];
        }
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
                        sort: 0
                    };
                })
            };
            return obj;
        });
        // const variantValue = productvariantList[0].variantValue;
        // let productVariantValues = await this.productVariantValueService.variantValuesByProductId(productId);
        // const uniqueVariants: any = [...new Map(productVariantValues.map(item => [item['variantId'], item])).values()];
        // productVariantValues = uniqueVariants.map((x, y) => {
        //     const obj = {
        //         variantId: x.variantId,
        //         type: x.type,
        //         name: x.name,
        //         values: productVariantValues.filter((i, indx) => i.variantId === x.variantId).map((ii, iii) => {
        //             return {
        //                 productVariantValueId: ii.productVariantValueId,
        //                 value: ii.value,
        //                 image: 'cybermart/Ven0061/Img_1671194559038.jpeg',
        //                 variantIndex: y,
        //             };
        //         })
        //     };
        //     return obj;
        // });
        // const variantValueArray = variantValue.split(',');
        // productVariantValues = productVariantValues.map((x, y) => {
        //     let values = x.values.map(v => {
        //         const check = variantValueArray.find(a => a == v.value);
        //         if (check) {
        //             return { ...v, sort: 1 }
        //         }
        //         return { ...v, sort: 0 }
        //     });
        //     values = orderBy(values, ['sort'], ['desc']);
        //     const obj = {
        //         ...x,
        //         values
        //     };
        //     return obj;
        // });
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

        const matchesValue = (variantValue, value) => {
            const parts = variantValue.split(',');
            return parts.includes(value);
        };

        // Iterate over the variants array
        for (let variant of productVariantValues) {
            // Iterate over the values array of each variant
            for (let value of variant.values) {
                // Find a matching variantValue in the productvariantList
                const matchedVariant = productvariantList.find(v => matchesValue(v.variantValue, value.value));
                
                // If a matching variant is found and it has an image with isDefault set to 1
                if (matchedVariant) {
                    const defaultImage = matchedVariant.images.find(img => img.isDefault === 1);
                    
                    // If a default image is found, assign its image string to the value object
                    if (defaultImage) {
                        value.image = defaultImage.image;
                    }
                }
            }
        }
        return productVariantValues;
    }

    public async variants(productId: any): Promise<any> {
        let productvariantList: any = await this.productVariantsService.find({ where: { productId } });
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
                        image: image ? image.image : '',
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

    // /api/buyer/products/get-payment-setting
    @Post('/get-payment-setting')
    public async paymentSettingList(@Req() request: any, @Res() response: any): Promise<any> {
        let taxAmount = '0';
        let shippingChargesTax = '0';
        let minimumCartAmount = '0';
        let itemSubTotalAmount = '0';
        const { type, cartGrandTotal, couponCode, couponSecret } = request.body;
        let couponAmount: any = undefined;
        if (couponCode || couponSecret) {
            if (!couponCode || !couponSecret) {
                return response.status(400).send({ status: 0, message: 'Invalid request! couponCode and couponSecret both are required', data: {}});
            }
            const a = await decryptTokenWithSecret(couponSecret, `cybermart_${couponCode}`);
            if (!a) {
                return response.status(400).send({ status: 0, message: 'Invalid couponCode!', data: {}});
            }
            couponAmount = a;
        }
       
        // shippingChargesId is for handling tax charges on latest selected shipping option 
        let { cartlist } = request.body;
        // For ios side, cartlist will be stringyfy
        if (typeof cartlist === 'string') {
            try {
                cartlist = JSON.parse(cartlist);
            } catch (error) { }
        }
        const minimumCartValue = await this.siteSettingsService.findOne({ where: { siteId: request.siteId, keyName: 'minimumCartValue' } });
        if (minimumCartValue) {
            minimumCartAmount = minimumCartValue.value;
            let p: any = await this.pluginService.findAll({ where: { pluginStatus: 1, siteId: request.siteId }});
            p = p.sort((a, b) => {
                if (a.sortOrder === 0) return 1;
                if (b.sortOrder === 0) return -1;
                return a.sortOrder - b.sortOrder;
              });
              
            }
        let p: any = await this.pluginService.findAll({ where: { pluginStatus: 1, siteId: request.siteId } });
        if (type && type === 'topup') {
            p = await this.pluginService.findAll({ where: { pluginStatus: 1, walletTopup: 1 } });
        }
        let paymentSettingList = p.map((x, y) => {
            return {
                pluginAvatar: x.pluginAvatar,
                pluginAvatarPath: x.pluginAvatarPath,
                id: x.id,
                pluginName: x.pluginName,
            };
        });
        if (cartGrandTotal) {
            if (parseFloat(cartGrandTotal) < parseFloat(minimumCartAmount)) {
                paymentSettingList = paymentSettingList.filter(i => i.id !== 2);
            }
        }
        let cartlistProducts = [];
        if (cartlist && cartlist.length > 0) {
            cartlistProducts = cartlist.map(i => {
                return {
                    ...i,
                    siteId: request.siteId
                }
            });
            const taxWithInfo = await this.productService.getTaxOnProductsForIndia(cartlistProducts, request, couponAmount);
            taxAmount = taxWithInfo.totalTax;
            shippingChargesTax = taxWithInfo.shippingChargesTax;
            console.log('parseFloat(taxWithInfo.grandTotal)', parseFloat(taxWithInfo.grandTotal));
            if (parseFloat(taxWithInfo.grandTotal) < parseFloat(minimumCartAmount)) {
                paymentSettingList = paymentSettingList.filter(i => i.id !== 2);
            }
            itemSubTotalAmount = taxWithInfo.itemSubtotal;
        }
        if (taxAmount == '0.00') {
            taxAmount = '0';
        }
        paymentSettingList = paymentSettingList.map((i, index) => {
            return {
                ...i,
                selected: index == 0 ? true : false
            }
        });
        return response.status(200).send({
            status: 1,
            message: 'Successfully got payment List.',
            data: paymentSettingList,
            taxAmount,
            shippingChargesTax,
            minimumCartAmount,
            itemSubTotalAmount
        });
    }

    // /api/buyer/products/product-reviews
    @Post('/product-reviews')
    public async productReviews(@Body({ validate: true }) params: ProductReviewsListingRequest, @Req() request: any, @Res() response: any): Promise<any> {
        const limit = params.limit;
        const offset = params.offset;
        const siteId = request.siteId;
        const slug = params.slug;
        if (!slug) {
            return response.status(400).send({ status: 0, message: 'Please add slug' });
        }
        const p = await this.productService.productDetails({ slug, siteId });
        if(p.productId === null){
            const res: any = {
                status: 1,
                message: 'listing',
                pages: 0,
                data: []
            };
            return response.status(200).send(res); 
        }
        const reviews = await this.productRatingsService.prodcutRatingListing({ limit, offset, siteId, productId: p.productId, count: false });
        let total = await this.productRatingsService.prodcutRatingListing({ limit: 0, offset: 0, siteId, productId: p.productId, count: true });
        total = total / limit;
        total = Math.ceil(total);
        const res: any = {
            status: 1,
            message: 'listing',
            pages: total,
            data: reviews
        };
        return response.status(200).send(res);
    }

    // /api/buyer/products/get-rating-statistics
    @Post('/get-rating-statistics')
    public async getProductRatingStatistics(@Req() request: any, @Res() response: any): Promise<any> {
        // await this.productRatingsService.create(newrating);
        const { slug, siteId } = request.body;
        if (!slug) {
            return response.status(400).send({ status: 0, message: 'Please add slug into body' });
        }
        const p = await this.productService.productDetails({ slug, siteId });
        if (!p) {
            return response.status(400).send({ status: 0, message: 'Invalid product' });
        }
        const ratings: any = [];
        for (let stars = 1; stars <= 5; stars++) {
            const WhereConditions = [
                { name: 'rating', op: 'where', value: stars },
                { name: 'productId', op: 'where', value: p.productId },
            ];
            const count = 1;
            const star = await this.productRatingsService.list(0, 0, 0, 0, WhereConditions, count);
            ratings.push(star);
        }
        const starsCount = [ratings[0], ratings[1], ratings[2], ratings[3], ratings[4]];
        const totalRatingReview = await this.productRatingsService.ratingStatistics(p.productId);
        const successResponse: any = {
            status: 1,
            message: 'successfully got the product ratings & review count.',
            data: { starsCount, totalRatingReview },
        };
        return response.status(200).send(successResponse);
    }

    // /api/buyer/products/courier-services-list
    @Post('/courier-services-list')
    public async courierServiceListing(@Req() request: any, @Res() response: any): Promise<any> {
        const listing = await this.courierService.find({ where: { countryId: 1, active: 1 } });
        return response.status(200).send({ status: 1, data: listing });
    }

    // /api/buyer/products/region-list
    @Post('/region-list')
    public async ParentRegionList(@Req() request: any, @Res() response: any): Promise<any> {
        //  let parent = 0;
        // const siteId = request.body.siteId;
        // const langId = request.body.langId;
        const zips = await getManager().query(`select * from shipping_regions where ${request.query.zipcode} between min_zipcode and max_zipcode`);
        console.log(zips);
        const categoryData = await this.regionService.find({});
        const s: any = {
            status: 1,
            message: '',
            data: categoryData,
        };
        return response.status(200).send(s);
    }

    @Post('/get-distance')
    public async Distance(@Req() request: any, @Res() response: any): Promise<any> {
        const AmharaLat = 42.50779000;
        const AmharaLong = 1.52109000;
        const distance = await getManager().query(
            `SELECT id,name, ( 3959 * acos( cos( radians(${AmharaLat}) ) * cos( radians( latitude) ) *
        cos(radians(longitude) - radians(${AmharaLong}) ) + sin( radians(${AmharaLat}) ) *
        sin( radians( latitude ) ))) AS distance FROM cities HAVING
        distance < 50 ORDER BY distance LIMIT 0 , 20;`);
        const s = await this.geocode();
        return response.json({
            longitude: s[1],
            latitude: s[0],
            data: distance,
        });
        /*
        let lat1 = request.query.lat1;
        // let lat2 = request.query.lat2;
        let lon1 = request.query.lon1;
        // let lon2 = request.query.lon2;
        lon1 =  lon1 * Math.PI / 180;
        // lon2 = lon2 * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let TigrayLat = 14.03233360;
        let TigrayLong = 38.31657250; 3959
        const promise = latLong.map(async (x: any) => {
            let dlon = x.longitude - lon1;
            let dlat = x.latitude - lat1;
            let a = Math.pow(Math.sin(dlat / 2), 2)
                + Math.cos(lat1) * Math.cos(x.latitude)
                * Math.pow(Math.sin(dlon / 2),2);
            let c = 2 * Math.asin(Math.sqrt(a));
        // Radius of earth in kilometers. Use 3956
        // for miles
        let r = 6371;
        let result = c * r;
        if(result <= 20){
        }
        return result
        });
        let value = await Promise.all(promise);
        */
    }
    public async geocode(): Promise<any> {
        let lat = 0;
        let lng = 0;
        const axio = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: 44000,
                key: 'AIzaSyDih6wY-Fn67unpZg4rDhfxLWLhBicVgwc',
            },
        });
        if (axio) {
            lat = axio.data.results[0].geometry.location.lat;
            lng = axio.data.results[0].geometry.location.lng;
            return [lat, lng];
        }
    }

    // /api/buyer/products/tax
    @Post('tax')
    public async GetTaxRate(@Req() request: any, @Res() response: any) {
        const obj = {
            showOnUi: 0,
            rate: 10,
        };
        return response.status(200).json({ status: 1, message: '', data: obj });
    }

    // /api/buyer/products/meta-info
    @Post('/meta-info')
    public async getMetaInfo(@Res() response: any, @Req() request: any): Promise<any> {
        const { page, slug } = request.body;
        const siteId = request.siteId;
        const langId = request.langId || 2;
        if (page) {
            const sitePage = await this.sitePageMlService.findOne({ where: { sitePageId: page, siteId, langId } });
            const data = {
                title: sitePage ? sitePage.metaTitle.replace(/ page meta title/, '') : '',
                keyword: sitePage ? sitePage.metaKeyword : '',
                description: sitePage ? sitePage.metaDescription : '',
            }
            return response.status(200).send({ status: 1, message: 'success', data });
        } else {
            let getCategoryOrProductBySlug: any = '';
            let isCategory: any = null;
            if (slug.length >= 1) {
                getCategoryOrProductBySlug = await this.siteCategoriesService.categoryBySlug(siteId, langId, slug.slice(-1)[0]);
                getCategoryOrProductBySlug ? isCategory = true : '';
                if (!getCategoryOrProductBySlug) {
                    getCategoryOrProductBySlug = await this.vendorProductService.findOne({ where: { slug: slug }, relations: ['productMetaInfo'] });
                    getCategoryOrProductBySlug ? isCategory = false : '';
                    if (getCategoryOrProductBySlug) {
                        const data = {
                            title: getCategoryOrProductBySlug && getCategoryOrProductBySlug.productMetaInfo ? getCategoryOrProductBySlug.productMetaInfo.title.replace(/ page meta title/, '') : '',
                            keyword: getCategoryOrProductBySlug && getCategoryOrProductBySlug.productMetaInfo ? getCategoryOrProductBySlug.productMetaInfo.keyword : '',
                            description: getCategoryOrProductBySlug && getCategoryOrProductBySlug.productMetaInfo ? getCategoryOrProductBySlug.productMetaInfo.description : '',
                            isCategory,
                            slug: slug && slug.slice(-1)[0]
                        }
                        return response.status(200).send({ status: 1, message: 'success', data });
                    }
                }
                const data = {
                    title: getCategoryOrProductBySlug && getCategoryOrProductBySlug.metaTitle ? getCategoryOrProductBySlug.metaTitle.replace(/ page meta title/, '') : '',
                    keyword: getCategoryOrProductBySlug && getCategoryOrProductBySlug.metaKeyword ? getCategoryOrProductBySlug.metaKeyword : '',
                    description: getCategoryOrProductBySlug && getCategoryOrProductBySlug.metaDescription ? getCategoryOrProductBySlug.metaDescription : '',
                    isCategory,
                    slug: slug && slug.slice(-1)[0]
                }
                return response.status(200).send({ status: 1, message: 'success', data });
            }
        }
    }
    // /api/buyer/products/sitemap-product-list
    @Post('/sitemap-product-list')
    public async ProductListForSitemap(@Res() response: any, @Req() request: any): Promise<any> {
        let productsList: any = await this.productService.siteMapProductlisting(request);
        productsList.map(product => product.slug = `/${product.slug}`);
        const siteId = request.siteId;
        const langId = 1;
        const categories = await this.siteCategoriesService.getCategoriesV2(siteId, langId);
        return response.status(200).send({
            status: 1,
            message: 'success',
            data: productsList,
            categories
        });
    }

    // /api/buyer/products/junaid-test-api
    @Post('/junaid-test-api')
    public async junaidTestAPI(@Res() response: any, @Req() request: any): Promise<any> {
        return response.status(200).send({ status: 1 });
    }

    // /api/buyer/products/same-day-options
    @Post('/same-day-options')
    public async checkSameDayOptions(@Body({ validate: true }) params: sameDayOptionsRequest, @Req() request: any, @Res() response: any): Promise<any> {

        const siteId = request.siteId;

        //const orderTimeDeadline = new Date();
        // orderTimeDeadline.setHours(15, 0, 0);

        const orderTimeDeadline = mtz().tz(getRegion(siteId)).hour(15);

        //const orderTime = new Date();
        //const userId = request.user?.userId; //Buyer

        const orderTime = mtz.tz(getRegion(siteId));

        let { vendorId, productId, pincode, price } = params;
        pincode = Number(pincode)
        console.log({ vendorId, productId, pincode, price })

        const sameDayResult: any = {};
        //const openBoxResult: any = {};

        let sdPincodesPresent = false;
        //let obPincodesPresent = false;

        // Check if Order time before orderTimeDeadline
        const todayOrTomorrow = orderTime <= orderTimeDeadline ? 'Today' : 'Tomorrow';
        console.log(todayOrTomorrow)

        const vendor = await this.vendorService.findOne({ where: { userId: vendorId } });

        const sellerAddress = await getRepository(UserAddresses).createQueryBuilder('UA')
            .where('UA.user_id = :id', { id: Number(vendorId) }).select('UA.*').getRawOne();

        if (!sellerAddress) {
            return response.status(400).send({ status: 0, message: 'Seller Address not found' });
        }

        //let productWeight = await this.productMeasurementsService.getWeightById(Number(productId));
        const standardDelivery = await this.shipmentService.checkStandardDelivery(sellerAddress.zipcode, pincode);

        if (vendor && vendor.sameDayActive == 1) {
            const shippingInfo = await this.productShippingInfoService.getSameDayOptsStatus(Number(productId));

            if (shippingInfo.find(ship => ship.type === 'same-day')) {
                //If product-level pincode list present     
                const sdProductpincodesList = await this.sameDayProductPincodeService.findPincodesByProductId(Number(productId), Number(vendorId));
                if (sdProductpincodesList.length > 0) {
                    sdPincodesPresent = sdProductpincodesList.includes(pincode);
                }
            }
            if (!sdPincodesPresent) {   //else check pincode in global list
                const sdglobalPincodesList = await this.sameDayGlobalPincodeService.getPincodesByVendorId(Number(vendorId));
                sdPincodesPresent = sdglobalPincodesList.includes(pincode);
            }
            if (sdPincodesPresent) {
                sameDayResult.available = true;
            }
            else {
                sameDayResult.available = false;
                sameDayResult.reason = 'Same Day is Unavailable at this pincode';
            }
        }
        else {
            sameDayResult.available = false;
            sameDayResult.reason = 'Same Day is Disabled'
        }
        // if (shippingInfo.find(ship => ship.type === 'open-box')) {

        //     const obProductPincodeList = await this.openBoxProductPincodeService.getPincodesByProductId(Number(productId), Number(vendorId));
        //     console.log(obProductPincodeList)
        //     if (obProductPincodeList.length > 0) {
        //         obPincodesPresent = obProductPincodeList.includes(pincode);

        //     } else {
        //         const obGlobalPincodesList = await this.openBoxGlobalPincodeService.getPincodesByVendorId(vendorId);
        //         console.log(obGlobalPincodesList)
        //         obPincodesPresent = obGlobalPincodesList.includes(pincode);
        //     }
        //     if (obPincodesPresent) {

        //         const user = await this.openBoxSubscriptionService.findByUserId(userId);
        //         console.log(user)
        //         //Check if user is subscribed
        //         if (user && user.isActive === 1 && user.isSubscribed === 1) {

        //             const minOpenBoxPrice = await this.siteSettingsService.findOne({ where: { keyName: 'min_price_open_box' } })
        //             //Check if product meets min. values
        //             openBoxResult.available = (Number(price) >= Number(minOpenBoxPrice.value)) ? true : false;
        //             console.log(minOpenBoxPrice)
        //             if (!openBoxResult.available) {
        //                 openBoxResult.reason = 'Product value must be at least ' + Number(minOpenBoxPrice.value) + ' for Open Box';
        //             }
        //         }
        //         else {
        //             openBoxResult.available = false;
        //             openBoxResult.reason = 'You are not Subscribed to Open Box';
        //         }
        //     }
        //     else {
        //         openBoxResult.available = false;
        //         openBoxResult.reason = 'Open Box is Unavailable at this pincode';
        //     }

        // }
        // else {
        //     openBoxResult.available = false;
        //     openBoxResult.reason = 'Open Box is Disabled'
        // }

        console.log(standardDelivery)

        let standardDeliveryStr = standardDelivery.bdPrepaid === true ? 'Standard Delivery is Available' : 'Standard Delivery is not Available';
        let sameDayDeliveryStr = sameDayResult.available ? '6 hr Delivery is Available ' + todayOrTomorrow : '6 hr Delivery is not Available'

        return response.status(200).send({ status: 1, message: 'Successfully Checked', data: { standardDeliveryStr, sameDayDeliveryStr } })

    }


    // /api/buyer/products/sites-info
    @Post('/sites-info')
    public async sitesInfo(@Req() request: any, @Res() response: any): Promise<any> {

        const siteId = request.siteId;
        const sitesettings = await this.siteSettingsService.find({where: { keyName: In(['showFullWidthBanner', 'defaultSortSetting']) }})

        const selects = [
            'S.iso1 as iso1',
            'S.currencySymbol as currencySymbol',
            // 'S.fbLink as fbLink',
            // 'S.instaLink as instaLink',
            // 'S.twitterLink as twitterLink',
            // 'S.linkedinLink as linkedinLink',
            // 'S.youtubeLink as youtubeLink',
            // 'S.pinterestLink as pinterestLink',
            'S.favicon as favicon',
            'S.logo as logo',
            'S.websiteLink as websiteLink',
            // 'S.playStoreAppUrl as playStoreAppUrl',
            // 'S.appleStoreAppUrl as appleStoreAppUrl',
            // 'S.QRCodePlayStoreApp as QRCodePlayStoreApp',
            // 'S.QRCodeAppleStoreApp as QRCodeAppleStoreApp',
            'S.contactInfo as contactInfo',
            'S.newHomepage as newHomepage',
            'S.topHeaderInfo as topHeaderInfo',
            'S.sellerWebsiteLink as SellerCentre',
            
            'S.bucketBaseUrl as bucketBaseUrl',
            'S.buyerApiUrl as buyerApiUrl',
            'S.countryId as countryId',
            'S.zipcodeFormate as zipcodeFormate'
        ];
        const select1 = [
            'S.iso1 as iso1',
            'S.websiteLink as websiteLink'
        ];
        const query = getConnection().getRepository(Sites).createQueryBuilder('S');
        const siteInfo  = await query.select(selects).where(`S.id = ${siteId}`).getRawOne();
        if (siteInfo && siteInfo.contactInfo) {
            siteInfo.contactEmail = JSON.parse(siteInfo.contactInfo).email;
            siteInfo.contactPhoneNo = JSON.parse(siteInfo.contactInfo).phone;
            siteInfo.address = JSON.parse(siteInfo.contactInfo).address;
            delete siteInfo.contactInfo;
        }
        siteInfo.showFullWidthBanner = sitesettings.find(i => i.keyName == 'showFullWidthBanner')?.value;
        siteInfo.defaultSortSetting = sitesettings.find(i => i.keyName == 'defaultSortSetting')?.value;
        let ids: number[];
        if(siteId == 1 || siteId == 2) {
            ids = [3];
        } else {
            ids = [1, 2];
        }

        const otherSitesInfo = await query.where('S.id != :siteId AND S.id IN (:ids)', { siteId, ids }).select(select1).getRawMany();

        return { siteInfo, otherSitesInfo };
    }

    @Post('/product-listing-2')
    public async productListingForNewHomepage(@Body({ validate: true }) params: ProductListingRequest, @Req() request: any, @Res() response: any): Promise<any> {

        let category: any;
        if (params.ptype === 'byCategory') {
            category = await this.categoriesService.categoryDetailsBySlug(request.siteId, 1, params.slug);
            if (!category) {
                return response.status(400).send({ status: 0, message: 'Invalid category slug', data: {} });
            }
            const allChildren = await this.categoriesService.getAllChildrenOfCategory(category.catId);
            request.body.categoryId = allChildren;
        }
        // const isUserLoggedIn = await this.functionService.isUserLoggedIn(request);
        // if (isUserLoggedIn) {
        //     request.user = {
        //         userId: isUserLoggedIn,
        //     };
        // }
        const sitesettings = await this.siteSettingsService.findOne({ where: { siteId: request.siteId, keyName: "hide_out_of_stock_products" } });
        if (request.body.is_home && sitesettings && sitesettings.value == 1) {
            request.body.outOfStock = true;
        }
        let productList: any = await this.productService.listing2(request);
        productList = productList.map(i => {
            return {
                ...i,
                pricerefer: i.pricerefer ? i.pricerefer.toString() : '',
                productDiscountId: i.productDiscountId ? i.productDiscountId : 0,
                discountPercentage: i.discountPercentage ? i.discountPercentage : '',
                navigate_to: 'product_details_screen',
                ordersInLast24Hours: '',
                soldCount: 0,
                tag: '',
                cronJobType: '',
                ProductFreeShipping: i.ProductFreeShipping ? i.ProductFreeShipping : '',
                category: i.brandName,
                categoryDescription: 'CyberMart',
                vendorStoreName: 'vendorStoreName',
                vendorStoreSlug: 'vendorStoreSlug',
                sectionProduct_id: null,
                sectionProduct_is_active: null,
                sectionProduct_product_id: null,
                sectionProduct_section_id: null,
                sectionProduct_sort_order: i.sectionProduct_sort_order ? i.sectionProduct_sort_order : 0
            };
        });
        let successResponse: any = {
            status: 1,
            message: 'listing',
            length: productList.length,
            data: productList,
        };

        return response.status(200).send(successResponse);
    }
}
