import { Service } from 'typedi';
import { BrandsService } from './BrandsService';
import { ProductService } from './ProductService';
import { SiteCategoriesService } from './SiteCategoriesService';
import { getConnection } from 'typeorm';
import { VendorStoreProfile } from '../models/VendorStoreProfile';
import { Vendor } from '../models/Vendor';
import { Users } from '../models/Users';
import Tracking from '../models/Tracking';
import Menus from '../models/menus';
import HomepageSectionManagement from '../models/HomepageSectionManagement';
import { SiteBanners } from '../models/SiteBanners';
import { Campaign } from '../models/Campaign';
import FooterBlog from '../models/FooterBlog';
// import FooterBlog from '../models/FooterBlog';
// import Blog from '../models/Blog';
// import { SiteCategories } from '../models/SiteCategories';

@Service()
export class HomeService {

    constructor(
        private productService: ProductService,
        private brandsService: BrandsService,
        private siteCategoriesService: SiteCategoriesService,
    ) {
    }

    public async trendingDealsProducts(request): Promise<any> {
        // {
        //     title: 'Shoes',
        //     image: 'dummy/shoes.png',
        //     type: '',
        //     navigate_to: 'catalog_screen',
        //     slug: 'men-clothing',
        // }
        const productList: any = await this.productService.trendingDealsProducts(request);
        return productList;
    }
    
    public async topCategoriesofMonth(siteId: number, langId: number): Promise<any> {
        let cats = await this.siteCategoriesService.topofMonth(siteId, langId);
        // let subCats : any; 
        // cats = cats.filter((c, i) => c.parent === 0);
        if (cats.length == 0) {
            // parent category id of magento
            cats = cats.filter((c, i) => c.parent === 2);
        }
        let categories = cats.map(async (item, index) => {
            // subCats = await this.siteCategoriesService.getSubCatsofTopOfMonth(item.categoryId, siteId, langId);
            return {
                title: item.name,
                image: item.image,
                type: '',
                navigate_to: 'catalog_screen',
                slug: item.slug,
                subCats: []
            };
        });
        categories = await Promise.all(categories);
        return categories;
    }

    public async topCategoriesofMonthOldV(siteId: number, langId: number): Promise<any> {
        const cats = await this.siteCategoriesService.topofMonth(siteId, langId);
        // let subCats : any; 
    
        let categories = cats.map(async (item, index) => {
            // subCats = await this.siteCategoriesService.getSubCatsofThisCat(item.categoryId, siteId, langId);
            return {
                title: item.name,
                image: item.image,
                type: '',
                navigate_to: 'catalog_screen',
                slug: item.slug,
                subCats: []
            };
        });
        categories = await Promise.all(categories);
        return categories;
    }

    public async homepageMiddleSectionBanners(siteId: any): Promise<any> {
        const sectionA = await this.banners(siteId, 'HMidB1');
        const sectionB = await this.banners(siteId, 'HMidB2');
        return { sectionA, sectionB };
    }

    public async featuredCategories(siteId: number, langId: number): Promise<any> {
        const cats = await this.siteCategoriesService.featured(siteId, langId);
        const categories = cats.map((item, index) => {
            return {
                title: item.name,
                image: item.image,
                type: '',
                navigate_to: 'catalog_screen',
                slug: item.slug,
                category_id: item.categoryId,
                section_products_sort_order: item.section_products_sort_order,
                category_sort_order: item.category_sort_order
            };
        });
        return categories;
    }

    public async topRatedStores(): Promise<any> {
        const selects = [
            'VendorStoreProfile.storeName as storeName',
            'VendorStoreProfile.slug as slug',
            'VendorStoreProfile.profileImage as profileImage',
        ];
        const results: any = await getConnection().getRepository(Users).createQueryBuilder('Users')
        .innerJoin(Vendor, 'Vendor', 'Vendor.userId = Users.userId')
        .innerJoin(VendorStoreProfile, 'VendorStoreProfile', 'VendorStoreProfile.userId = Users.userId')
        .where('Vendor.statusId = :statusId', { statusId: 'Active' })
        .andWhere('Vendor.isProfileCompleted = :isProfileCompleted', { isProfileCompleted: 'Y' })
        .andWhere('VendorStoreProfile.isTopRated = 1')
        .select(selects).getRawMany();
        return results.map(item => {
            return {
                title: item.storeName,
                image: item.profileImage,
                type: '',
                navigate_to: 'vendor_profile',
                slug: item.slug,
            }
        });
    }

    public async banners(siteId: number, type: string): Promise<any> {
        const a = await getConnection()
        .getRepository(SiteBanners)
        .createQueryBuilder("SB")
        .leftJoin(Campaign, 'C', 'C.slug = SB.url')
        .where('SB.siteId = :siteId AND SB.isActive = :isActive AND SB.type = :type', {
            siteId: siteId,
            isActive: 1,
            type: type
        })
        .andWhere('(C.isActive = :isActive OR C.isActive IS NULL) AND (NOW() BETWEEN C.startDate AND C.endDate OR C.startDate IS NULL OR C.endDate IS NULL)', { isActive: 1 })
        .select([
            '"" as title',
            'SB.image as image',
            'SB.type as type',
            'SB.destinationType as navigate_to',
            'SB.url as slug',
            'C.campaignName as campaignName'
        ])
        .orderBy('SB.id', 'DESC')
        .getRawMany();

        return a;
    }

    public async popularBrands(request: any): Promise<any> {
        const siteId = request.siteId;
        let brands = await this.brandsService.listing({ limit: 10, offset: 0, siteId, isFeatured: 1 });
        brands = brands.map((b, bi) => {
            return {
                title: b.name,
                image: b.image,
                type: '',
                navigate_to: 'brand_screen',
                slug: b.slug,
            };
        });
        return brands;
    }

    public async categoricalProductsView(): Promise<any> {
        const a = [
            {
                id: 1,
                title: 'Trending Deals',
                productsCount: 112212,
                fromPrice: 100,
                toPrice: 1500,
                data: [
                    { image: 'banner/shoes.png', title: 'Shoes' },
                    { image: 'banner/wood.png', title: 'Wood' },
                    { image: 'banner/shirts.png', title: 'Shirts' },
                ]
            },
            {
                id: 2,
                title: 'Most Demanding Products',
                productsCount: 112212,
                fromPrice: 100,
                toPrice: 1500,
                data: [
                    { image: 'banner/Mobile.png' },
                    { image: 'banner/electronics.png' },
                    { image: 'banner/shirts.png' },
                ]
            },
            {
                id: 3,
                title: 'Top Ranked Products',
                productsCount: 112212,
                fromPrice: 100,
                toPrice: 1500,
                data: [
                    { image: 'dummy/cap.png' },
                    { image: 'dummy/doll.png' },
                    { image: 'dummy/cap.png' },
                ]
            },
            {
                id: 4,
                title: 'Drop Shipping',
                productsCount: 112212,
                fromPrice: 100,
                toPrice: 1500,
                data: [
                    { image: 'dummy/cap.png' },
                    { image: 'dummy/doll.png' },
                    { image: 'dummy/cap.png' },
                ]
            },
        ];
        const b = {
            title: 'Discounts By Category',
            products: [
                {
                    title: 'Men Fashion',
                    fromPrice: 100,
                    toPrice: 1500,
                    data: [
                        { image: 'dummy/cap.png' },
                        { image: 'dummy/doll.png' },
                        { image: 'dummy/cap.png' },
                    ]

                },
                {
                    title: 'Watches & Accessories',
                    fromPrice: 100,
                    toPrice: 1500,
                    data: [
                        { image: 'dummy/cap.png' },
                        { image: 'dummy/doll.png' },
                        { image: 'dummy/cap.png' },
                    ]

                },
                {
                    title: 'Women Fashion Jewellery',
                    fromPrice: 100,
                    toPrice: 1500,
                    data: [
                        { image: 'dummy/cap.png' },
                        { image: 'dummy/doll.png' },
                        { image: 'dummy/cap.png' },
                    ]

                }
            ]
        }
        return { section1: a, section2: b };
    }
    public async trackingList(request: any): Promise<any> {
        const siteId = request.siteId;
        var page = 1;
        var limit = 10;
        if (request.query.page) {
            page = parseInt(request.query.page.toString())
        }
        if (request.query.limit) {
            limit = parseInt(request.query.limit.toString())
        }
        var skip = (limit * page) - limit;
        const query = await Tracking.createQueryBuilder("tracking")
            .select(['id','title','description','image_url','is_active','is_mobile_view','design_id','sort_order'])
            .where("tracking.site_id = :siteId", { siteId: siteId })
            .andWhere("tracking.is_active = 1");
        if(request.query.is_mobile){
            query.andWhere("tracking.is_mobile_view = 1");
        }else{

            query.andWhere("tracking.is_web_view = 1");
        }
        query.orderBy("sort_order", "ASC");
        query.offset(skip).limit(limit);
        
        const result = await query.getRawMany()

        if (!result) {
            return null;
        }
        return result;
    }
    public async blogList(request: any): Promise<any> {
        const siteId = request.siteId;
        var page = 1;
        var limit = 10;
        if (request.query.page) {
            page = parseInt(request.query.page.toString())
        }
        if (request.query.limit) {
            limit = parseInt(request.query.limit.toString())
        }
        var skip = (limit * page) - limit;
        const result = await FooterBlog.createQueryBuilder("footer_blog")
            .select("*")
            .where("footer_blog.site_id = :siteId", { siteId: siteId })
            .orderBy("footer_blog.id", "DESC") 
            .offset(skip).limit(limit)
            .getRawMany();
        if (!result) {
            return null;
        }

        return result;
    }
    public async menus(request: any): Promise<any> {
        const siteId = request.siteId;
        const selectMenusData =[
            'menus.id',
            'menus.image_url',
            'menus.is_MMM',
            'menus.is_active',
            'menus.is_show_on_mobile',
            'menus.is_show_on_web',
            'menus.label_image_url',
            'menus.label_text',
            'menus.name',
            'menus.parent_id',
            'menus.sort_order',
            'menus.source_id',
            'menus.source_ref_id',
            'menus.url',
            'menus.MMM_link',
            'menus.MMM_url',
            'menus.box_dimension',
            'menus.menu_type'
        ];
        const selectSubMenusData =[
            'subMenus.id',
            'subMenus.image_url',
            'subMenus.is_MMM',
            'subMenus.is_active',
            'subMenus.is_show_on_mobile',
            'subMenus.is_show_on_web',
            'subMenus.label_image_url',
            'subMenus.label_text',
            'subMenus.name',
            'subMenus.parent_id',
            'subMenus.sort_order',
            'subMenus.source_id',
            'subMenus.source_ref_id',
            'subMenus.url',
            'subMenus.MMM_link',
            'subMenus.MMM_url',
            'subMenus.box_dimension'
        ];
        const selectAddonData =[
            'addon.id',
            'addon.image_url',
            'addon.is_MMM',
            'addon.is_active',
            'addon.is_show_on_mobile',
            'addon.is_show_on_web',
            'addon.label_image_url',
            'addon.label_text',
            'addon.name',
            'addon.parent_id',
            'addon.sort_order',
            'addon.source_id',
            'addon.source_ref_id',
            'addon.url',
            'addon.MMM_link',
            'addon.MMM_url',
            'addon.box_dimension'
        ];
        // i have discuss the sublevel issue with armughan bhai and we decide that we just go upto 3rd level in child.
        const query = await Menus.createQueryBuilder("menus")
            .leftJoin('menus.children', 'subMenus', `subMenus.is_show_on_web = true`)
            .leftJoin('subMenus.children', 'addon', `addon.is_show_on_web = true`)
            .leftJoin('menus.category', 'category', `menus.source_ref_id = category.id AND menus.source_id = 1`)
            .leftJoin('category.siteCategory', 'siteCategory')
            .leftJoin('category.categoriesML', 'CategoryML', 'CategoryML.lang_id = 1')
            .leftJoin('category.children', 'subCategories')
            .leftJoin('subCategories.siteCategory', 'subCategoriesSiteCategory')
            .leftJoin('subCategories.categoriesML', 'subCategoriesCategoryML', 'subCategoriesCategoryML.lang_id = 1')
            .leftJoin('subCategories.children', 'catAddon')
            .leftJoin('catAddon.siteCategory', 'catAddonSiteCategory')
            .leftJoin('catAddon.categoriesML', 'catAddonCategoryML', 'catAddonCategoryML.lang_id = 1')
            .leftJoin('menus.campaign', 'campaign', `menus.source_ref_id = campaign.id AND menus.source_id = 2 AND campaign.isActive = 1`)
            .select(selectMenusData)
            .addSelect(selectSubMenusData)
            .addSelect(selectAddonData)
            .addSelect(['category.id','category.sortOrder','category.urlKey'])
            .addSelect(['CategoryML.name','CategoryML.isActive'])
            .addSelect(['subCategories.id','subCategories.sortOrder','subCategories.urlKey'])
            .addSelect(['subCategoriesCategoryML.name','subCategoriesCategoryML.isActive'])
            .addSelect(['catAddon.id','catAddon.sortOrder','catAddon.urlKey'])
            .addSelect(['catAddonCategoryML.name','catAddonCategoryML.isActive'])
            .addSelect(['campaign.id','campaign.campaign_name','campaign.is_active','campaign.slug','campaign.start_date','campaign.end_date','campaign.status'])
            // .addSelect(['siteCategory.catId', 'siteCategory.isActive', 'siteCategory.showInMenu'])
            // .addSelect(['subCategoriesSiteCategory.catId', 'subCategoriesSiteCategory.isActive', 'subCategoriesSiteCategory.showInMenu'])
            // .addSelect(['catAddonSiteCategory.catId', 'catAddonSiteCategory.isActive', 'catAddonSiteCategory.showInMenu'])
            .where("menus.parent_id IS NULL")
            .andWhere("(menus.source_id <> 1 OR (siteCategory.isActive = 1 AND siteCategory.showInMenu = 1 AND menus.source_id = 1))")
            .andWhere("(subCategoriesSiteCategory.isActive = 1 AND subCategoriesSiteCategory.showInMenu = 1 OR subCategoriesSiteCategory.isActive IS NULL)")
            .andWhere("(catAddonSiteCategory.isActive = 1 AND catAddonSiteCategory.showInMenu = 1 OR catAddonSiteCategory.isActive IS NULL)")
            .andWhere("menus.site_id =:site_id", { site_id: siteId })
            .andWhere("menus.is_active =true")
            .andWhere("(menus.source_id <> 2 OR (menus.source_id = 2 AND campaign.id IS NOT NULL))"); 
        if (request.query.is_show_on_mobile) {
            query.andWhere("menus.is_show_on_mobile =true");
        } else {
            query.andWhere("menus.is_show_on_web =true");
        }
        query.orderBy('menus.sort_order', 'ASC')
        .addOrderBy('subCategories.sort_order', 'ASC')
        .addOrderBy('catAddon.sort_order', 'ASC')
        .addOrderBy('subMenus.sort_order', 'ASC')
        .addOrderBy('addon.sort_order', 'ASC')
        const result = await query.getMany();
        if (!result) {
            return null;
        }
        return result;
    }

    public async homepageSections(request: any): Promise<any> {
        const siteId = request.siteId;
        const result = await HomepageSectionManagement.createQueryBuilder("homepage_section_management")
            .leftJoin('homepage_section_management.homeSectionType', 'homeSectionType')
            .leftJoin('homepage_section_management.children', 'subSection')
            .leftJoin('subSection.homeSectionType', 'subSectionHomeSectionType')
            .leftJoin('subSection.children', 'addon')
            .leftJoin('addon.homeSectionType', 'addonHomeSectionType')
            .select(['homepage_section_management.id','homepage_section_management.parent_id','homepage_section_management.name','homepage_section_management.slug'
            ,'homepage_section_management.api_path','homepage_section_management.component_name','homepage_section_management.description','homepage_section_management.side_banner_url'
            ,'homepage_section_management.api_payload','homepage_section_management.sort_order','homepage_section_management.is_active'
            ,'homepage_section_management.is_show_side_banner','homepage_section_management.design_type_id','homepage_section_management.section_type_id','homepage_section_management.category_id'])
            .addSelect(['homeSectionType.id','homeSectionType.name','homeSectionType.api_path','homeSectionType.sort_order'])
            .addSelect(['subSection.id','subSection.parent_id','subSection.name','subSection.slug'
            ,'subSection.api_path','subSection.component_name','subSection.description','subSection.side_banner_url'
            ,'subSection.api_payload','subSection.sort_order','subSection.is_active'
            ,'subSection.is_show_side_banner','subSection.design_type_id','subSection.section_type_id','subSection.category_id'])
            .addSelect(['subSectionHomeSectionType.id','subSectionHomeSectionType.name','subSectionHomeSectionType.api_path','subSectionHomeSectionType.sort_order'])
            .addSelect(['addon.id','addon.parent_id','addon.name','addon.slug'
            ,'addon.api_path','addon.component_name','addon.description','addon.side_banner_url'
            ,'addon.api_payload','addon.sort_order','addon.is_active'
            ,'addon.is_show_side_banner','addon.design_type_id','addon.section_type_id','addon.category_id'])
            .addSelect(['addonHomeSectionType.id','addonHomeSectionType.name','addonHomeSectionType.api_path','addonHomeSectionType.sort_order'])
            .where("homepage_section_management.parent_id IS NULL")
            .andWhere("homepage_section_management.is_active =:is_active", {is_active: true})
            .andWhere("homepage_section_management.site_id =:site_id", { site_id: siteId })
            .orderBy({
                "CASE WHEN homepage_section_management.slug = :slug THEN 0 ELSE 1 END": "ASC",
                "homepage_section_management.sort_order": "ASC",
              })
              .setParameters({ slug: 'main-banner' })
            .addOrderBy('subSection.sort_order', "ASC")
            .addOrderBy('addon.sort_order', "ASC")
            .getMany();
        if (!result) {
            return null;
        }
        return result;
    }

    public async homepageFeaturedCategories(request: any): Promise<any> {
        const siteId = request.siteId;
        const result = await HomepageSectionManagement.createQueryBuilder("homepage_section_management")
        .leftJoin('homepage_section_management.homeSectionType', 'homeSectionType')
        .leftJoin('homepage_section_management.children', 'subSection')
        .leftJoin('subSection.homeSectionType', 'subSectionHomeSectionType')
        .leftJoin('subSection.children', 'addon')
        .leftJoin('addon.homeSectionType', 'addonHomeSectionType')
        .select('homepage_section_management.id')
        // .addSelect(['homeSectionType.id','homeSectionType.name','homeSectionType.api_path','homeSectionType.sort_order'])
        .addSelect(['subSection.id','subSection.name','subSection.slug'
        ,'subSection.component_name','subSection.side_banner_url','subSection.api_payload','subSection.parent_id', 'subSection.is_show_side_banner'])
        // .addSelect(['subSectionHomeSectionType.id','subSectionHomeSectionType.name','subSectionHomeSectionType.api_path','subSectionHomeSectionType.sort_order'])
        .addSelect(['addon.id','addon.name','addon.slug'
        ,'addon.component_name','addon.side_banner_url','addon.api_payload','addon.parent_id', 'addon.is_show_side_banner'])
        // .addSelect(['addonHomeSectionType.id','addonHomeSectionType.name','addonHomeSectionType.api_path','addonHomeSectionType.sort_order'])
        .where("homepage_section_management.component_name =:FeaturedCategories", { FeaturedCategories: "FeaturedCategories" })
        .andWhere("homepage_section_management.site_id =:site_id", { site_id: siteId })
        .andWhere("homepage_section_management.id =:id", { id: request.query.section_id })
        .orderBy("homepage_section_management.sort_order", "ASC")
        .getMany();

        const processedResult = result[0].children.map(item => {
            if (item.is_show_side_banner && item.children.length > 0) {
                  item.children = [];
            }
            return item;
        });
          
        result[0].children =  processedResult;
        
        if (!result) {
            return null;
        }
        return result;
    }
}
