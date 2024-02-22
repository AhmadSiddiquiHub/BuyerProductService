import 'reflect-metadata';
import { JsonController, Res, Req, Post, Body } from 'routing-controllers';
import { CategoriesServices } from '../services/CategoriesService';
import { CategoryMlService } from '../services/CategoryMlService';
import { CategoryPathService } from '../services/CategoryPathService';
import { SiteCategoriesService } from '../services/SiteCategoriesService';
import { CatalogFilterRequestRequest, SpecificCategoryListRequest } from './requests/buyer';
import { VariantsToCategoryService } from '../services/VariantsToCategoryService';
import { ProductAttributesToCategoryService } from '../services/ProductAttributesToCategoryService';
import { ProductService } from '../services/ProductService';
import { uniqBy } from 'lodash';
import { VendorProductService } from '../services/VendorProductService';
import { In } from 'typeorm';
// import { Categories } from '../models/Categories';
// import { SiteCategories } from '../models/SiteCategories';
// import { CategoriesML } from '../models/CategoriesML';
// import { Brands } from '../models/Brands';
// import { SiteBrands } from '../models/SiteBrand';
// import { BrandsMetaInfo } from '../models/BrandsMetaInfo';
// import { SiteBrandsService } from '../services/SiteBrandsService';
import { BrandsService } from '../services/BrandsService';
import { SiteSettingsService } from '../services/SiteSettingsService';
// import { BrandsMetaInfoService } from '../services/BrandsMetaInfoService';
// import { BrandsMetaInfo } from '../models/BrandsMetaInfo';
// import { CategoryPath } from '../models/CategoryPath';

@JsonController('/category')
export class CategoryController {
    constructor(
        private siteCategoriesService: SiteCategoriesService,
        private categoriesService: CategoriesServices,
        private categoryPathService: CategoryPathService,
        private categoryMlService: CategoryMlService,
        private variantsToCategoryService: VariantsToCategoryService,
        private productAttributesToCategoryService: ProductAttributesToCategoryService,
        private productService: ProductService,
        private vendorProductService: VendorProductService,
        // private siteBrandsService: SiteBrandsService,
        private brandsService: BrandsService,
        private siteSettingsService: SiteSettingsService,
        
        // private brandsMetaInfoService: BrandsMetaInfoService,
    ) {}

    // /api/buyer/products/category/specific-category-list
    @Post('/specific-category-list')
    public async SpecificcategoryList(@Body({ validate: true }) params: SpecificCategoryListRequest, @Req() request: any, @Res() response: any): Promise<any> {
        const categorySlugParam = params.categorySlug;
        const categoryDataId = await this.categoriesService.findOne({ where: { urlKey: categorySlugParam } });
        if (categoryDataId === undefined) {
            const errorResponse: any = { status: 0, message: 'Invalid categoryId' };
            return response.status(400).send(errorResponse);
        }
        const categoryDetailId = await this.categoryPathService.findOne({ where: { catId: categoryDataId.id }, order: { level: 'DESC' } });
        if (!categoryDetailId) {
            const sr: any = { status: 1, message: 'sub category of this category not found', data: { children: [] } };
            return response.status(200).send(sr);
        }
        const select = ['id', 'image', 'parentInt', 'urlKey'];
        const whereCondition = [{ name: 'parentInt', op: 'where', value: categoryDetailId.pathId }];
        let categoryData = await this.categoriesService.list(0, 0, select, 0, whereCondition, 0, 0);
        if (categoryData.length === 0) {
            const w = [
                { name: 'parentInt', op: 'where', value: categoryDataId.parentInt },
            ];
            categoryData = await this.categoriesService.list(0, 0, select, 0, w, 0, 0);
        }
        categoryData = categoryData.map(async (item) => {
            return {
                id: item.id,
                parentInt: item.parentInt,
                categorySlug: item.urlKey,
                image: item.image,
                langId: item.categoriesML.langId,
                name: item.categoriesML.name,
                metaTitle: item.categoriesML.metaTitle,
                metaKeyword: item.categoriesML.metaKeyword,
                metaDescription: item.categoriesML.metaDescription,
            };
        });
        categoryData = await Promise.all(categoryData);
        // await this.redisService.set(redisKeys.SpecificCatList, JSON.stringify(categoryData))
        const priceRange = [
            { txt: '0 - 10,000', min: 0, max: 10000 },
            { txt: '10,000 - 50,000', min: 10000, max: 50000 },
            { txt: '50,000 - 100,000', min: 50000, max: 100000 },
            { txt: '100,000 - 500,000', min: 100000, max: 500000 },
        ];
        let catpath: any;
        catpath = await this.categoryPathService.find({ where: { catId: categoryDataId.id }, order: { level: 'ASC' } });
        catpath = catpath.map(async (item, index) => {
            const tempVal: any = item;
            const c = await this.categoriesService.findOne({ where: { id: item.pathId } });
            const cc = await this.categoryMlService.findOne({ where: { catId: c.id } });
            tempVal.categoryName = cc.name;
            tempVal.categoryId = c.id;
            tempVal.categorySlug = c.urlKey;
            return tempVal;
        });
        catpath = await Promise.all(catpath);
        if (catpath.length > 0) {
            catpath = [{ categorySlug: '/', categoryName: 'Home' }].concat(catpath);
        }
        // brands
        const brands = await this.categoriesService.brandsbycategoryList(categorySlugParam);
        const successResponse: any = {
            status: 1,
            message: 'Successfully get the related category List',
            data: { brands: brands, children: categoryData, price_range: priceRange, categoryLevel: catpath },
        };
        return response.status(200).send(successResponse);
    }

    // /api/buyer/products/category/catalog-filters
    @Post('/catalog-filters')
    public async SpecificCategoryListV2(@Body({ validate: true }) params: CatalogFilterRequestRequest, @Req() request: any, @Res() response: any): Promise<any> {
        const slug = params.categorySlug;
        const siteId = request.siteId;
        const langId = 1;
        request.body.count = 0;
        request.body.offset = 0;
        request.body.limit = 100000000000000;
        request.body.ptype = 'all';
        const categories = await this.siteCategoriesService.getCategoriesV2(siteId, langId);
        let brands: any = [];

        const category = await this.categoriesService.categoryDetailsBySlug(siteId, langId, slug);
        if (!category) {
            return response.status(400).send({ status: 0, message: '', data: {}});
        }
        // it means this category is root category
        if (category.parent == 0) {
            const catIds = [];
            const a = categories.filter(i => i.parent == category.catId);
            if (a.length === 0) {
                request.body.categoryId = [category.catId];
            }
            for (let i = 0; i < a.length; i++) {
                const e = a[i];
                catIds.push(e.categoryId);
                const b = categories.filter(i => i.parent == e.categoryId);
                for (let ii = 0; ii < b.length; ii++) {
                    const ee = b[ii];
                    catIds.push(ee.categoryId);
                }
            }
            request.body.categoryId = [...new Set(catIds)];
        }
        let variants = await this.variantsToCategoryService.getVariantsOfCategory(category.catId, siteId);
        variants = uniqBy(variants, 'id');
        const variantIds = variants.map(v => v.id);     
        let productIds: any = await this.productService.listing(request);
        productIds = productIds.map(i => i.productId);
        //Get brands that belongs to products
        let brandIds = await this.vendorProductService.find({where: { productId: In(productIds) }, select: ['brandId']})
        brandIds = await brandIds.map((i: any) => i.brandId);
        if (brandIds.length > 0) {
            brands = await this.brandsService.find({ where: { id: In(brandIds), isActive: 1 }, order: { name: 'ASC' }});
            brands = brands.map((b, i) => {
                return {
                    id: b.id,
                    name: b.name,
                    selected: 0,
                };
            });
        }
        let valuesOfVariants = await this.variantsToCategoryService.getValuesOfVariantsById(variantIds, productIds);
        valuesOfVariants = uniqBy(valuesOfVariants, 'name')
        variants = variants.map(async (v, i) => {
            const values = valuesOfVariants.filter(value => value.variantId == v.id);
            const vs = values.map((value, valueIndex) => {
                return { ...value, selected: 0 };
            })
            return { ...v, values: vs };
        });
        variants = await Promise.all(variants);
        // if the values are empty then do not show on frontend
        variants = variants.filter(i => i.values.length > 0);
        // fetch all attributes values by category Id from product_attributes_values then make array of unique attributes with their values
        let attributes = await this.productAttributesToCategoryService.getDistinctAttributes_ByCategory(category.catId);
        const uniqueAttributes: any = [...new Map(attributes.map(item => [item['productAttributeId'], item])).values()];
        // const uniqueAttributes = attributes.map(item => item.productAttributeId).filter((value, index, self) => self.indexOf(value) === index);
        attributes = uniqueAttributes.map((item, index) => {
            const a = attributes.filter((a, b) => a.productAttributeId === item.productAttributeId);
            const b = a.map((x, y) => {
                return {
                    productAttributeId: item.productAttributeId,
                    name: x.name,
                    id: x.id,
                    selected: 0,
                };
            });
            return {
                productAttributeId: item.productAttributeId,
                label: item.label,
                values: b,
            };
        });
        const othersCategories = await this.categoriesService.getChildsByCategory(siteId, langId, category);
        const categoryPath = await this.categoriesService.categoriesPathByCatId(category.catId);
        const filterByPriceRange = 1;
        const filterByRating = 1;
        const { value } = await this.siteSettingsService.findOne({ where: { keyName: 'Show_SubCategories_On_Top_Of_Catalog_Page' } });
        const settings = await this.siteSettingsService.findOne({ where: { keyName: 'default_Category_Filter' } });
        const data = {
            filterByPriceRange,
            filterByRating,
            showSubCategoriesOnCatalogPage : parseInt(value),
            category,
            brands,
            variants,
            attributes,
            othersCategories,
            categoryPath,
            defaultCategoryFilter: settings.value
        }
        return response.status(200).send({ status: 1, message: '', data });
    }

    // /api/buyer/products/category/category-list
    @Post('/category-list')
    public async categoryListing(@Req() request: any, @Res() response: any): Promise<any> {
        const siteId = request.siteId;
        const langId = 1;
        let categories = await this.siteCategoriesService.getCategoriesV2(siteId, langId);
        categories = categories.map((c, i) => {
            return {
                ...c,
                children: [],
            };
        });
        let cats = categories.filter((c, i) => c.parent === 0);
        if (cats.length == 0) {
            // parent category id of magento
            cats = categories.filter((c, i) => c.parent === 2);
        }
        cats = cats.map((category, index) => {
            const subCats = categories.filter((c, i) => c.parent === category.categoryId);
            const y = subCats.map((subCat, subCatIndex) => {
                const subCatsChild = categories.filter((c, i) => c.parent === subCat.categoryId);
                subCat.redirectUrl = `/${category.slug}/${subCat.slug}`;
                subCatsChild.map(child => child.redirectUrl = `${subCat.redirectUrl}/${child.slug}`)
                return {
                    ...subCat,
                    children: subCatsChild,
                }
            });
            category.redirectUrl = `/${category.slug}`; 
            return {
                ...category,
                children: y,
            }
        });
        if (request.device && request.device === 'web') {
            return response.status(200).send({ status: 1, message: 'list', data: cats, catsLen: cats.length });
        }
        cats = cats.map(i => {
            if (i.parent === 0 && i.children.length === 0) {
                i.children = [
                    {...i}
                ];
            }
            return i;
        });
        return response.status(200).send({ status: 1, message: 'list', data: { categories: cats, catsLen: cats.length } });
    }

    // /api/buyer/products/category/category-list
    @Post('/search-by-category')
    public async searchBycategoriesListing(@Req() request: any, @Res() response: any): Promise<any> {
        const siteId = request.siteId;
        const langId = 1;
        let categories = await this.siteCategoriesService.getSearchByCategories(siteId, langId);
        return response.status(200).send({ status: 1, message: 'list', data: { categories: categories, catsLen: categories.length } });
    }
}