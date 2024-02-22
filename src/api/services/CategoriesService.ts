import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { CategoriesRepository } from '../repositories/CategoriesRepository';
import {Categories} from '../models/Categories';
import { getConnection, Like } from 'typeorm';
import { CategoryBrand } from '../models/CategoryBrand';
import { Brands } from '../models/Brands';
import { CategoriesML } from '../models/CategoriesML';
import { SiteCategories } from '../models/SiteCategories';
import { CategoryPath } from '../models/CategoryPath';
import { VendorProductCategory } from '../models/VendorProductCategory';

@Service()
export class CategoriesServices {

    constructor(
        @OrmRepository() private categoriesRepository: CategoriesRepository) {
    }
     // create Category
    public async create(category: any): Promise<Categories> {
        return this.categoriesRepository.save(category);
    }
    // findone category
    public findOne(category: any): Promise<any> {
        return this.categoriesRepository.findOne(category);
    }
  // delete Category
    public async delete(id: number): Promise<any> {
        await this.categoriesRepository.delete(id);
        return;
    }
  // categoryList
    public list(limit: any, offset: any, select: any = [], search: any = [], whereConditions: any = [], sortOrder: number , count: number | boolean): Promise<any> {
        const condition: any = {};

        if (select && select.length > 0) {
            condition.select = select;
        }
        condition.where = {};

        if (whereConditions && whereConditions.length > 0) {
            whereConditions.forEach((item: any) => {
                condition.where[item.name] = item.value;
            });
        }

        if (search && search.length > 0) {
            search.forEach((table: any) => {
                const operator: string = table.op;
                if (operator === 'where' && table.value !== undefined) {
                    condition.where[table.name] = table.value;
                } else if (operator === 'like' && table.value !== undefined) {
                    condition.where[table.name] = Like('%' + table.value + '%');
                }
            });
        }

        if (limit && limit > 0) {
            condition.take = limit;
            condition.skip = offset;
        }

    condition.order = { sortOrder: (sortOrder === 2) ? 'DESC' : 'ASC' /* createdDate: 'DESC'*/};
    condition.relations = ['categoriesML'];
        if (count) {
            return this.categoriesRepository.count(condition);
        }
        return this.categoriesRepository.find(condition);
    }

    public listing(whereConditions: any = []): Promise<any> {
        const condition: any = {};
        condition.where = {};
        if (whereConditions && whereConditions.length > 0) {
            whereConditions.forEach((item: any) => {
                condition.where[item.name] = item.value;
            });
        }
        return this.categoriesRepository.find(condition);
    }

    // find category
    public find(category: any): Promise<any> {
        return this.categoriesRepository.find(category);
    }

    public async brandsbycategoryList(categoryslug: string) {
        const query: any = await getConnection().getRepository(Categories).createQueryBuilder('categories');
        query.select(['brands.name as name', 'brands.id as id']);
        query.where('categories.urlKey = :categoryslug', { categoryslug });
        // query.andWhere('categories.siteId = :siteId', { siteId });
        query.innerJoin(CategoryBrand, 'category_brand', 'categories.id = category_brand.cat_id');
        query.innerJoin(Brands, 'brands', 'brands.id = category_brand.brand_id');
        return query.getRawMany();
    }

    public async categoryFromArrayIds(ids: any, langId: any) {
        const selects = [
            'C.urlKey as categorySlug',
            'CML.name as name',
            'CML.metaTitle as metaTitle',
            'CML.metaKeyword as metaKeyword',
            'CML.metaDescription as metaDescription',
            'CML.catId as catId',
        ];
        const query: any = await getConnection().getRepository(Categories).createQueryBuilder('C');
        query.select(selects);
        query.innerJoin(CategoriesML, 'CML', 'C.id = CML.catId');
        // query.where('CML.siteId = :siteId', { siteId });
        query.andWhere('CML.langId = :langId', { langId });
        query.andWhere('C.id IN (' + ids + ')');
        return query.getRawMany();
    }

    public async categoryDetailsBySlug(siteId: any, langId: any, slug: any) {
        const selects = [
            'CML.name as name',
            'CML.metaTitle as metaTitle',
            'CML.metaKeyword as metaKeyword',
            'CML.metaDescription as metaDescription',
            'CML.catId as catId',
            'C.parent as parent',
            'C.description as categoryDescription',
        ];
        const query: any = await getConnection().getRepository(Categories).createQueryBuilder('C');
        query.innerJoin(CategoriesML, 'CML', 'C.id = CML.catId');
        query.innerJoin(SiteCategories, 'SC', `C.id = SC.catId AND SC.siteId = ${siteId}`);
        query.where(`CML.langId = ${langId}`);
        query.andWhere('C.urlKey = :slug', { slug });
        query.andWhere('SC.isActive = 1')
        return query.select(selects).getRawOne();
    }

    public async brandsForCatalogFilters(categoryslug: string) {
        const selects = [
            'B.name as name',
            'B.id as id'
        ];
        const query: any = await getConnection().getRepository(Categories).createQueryBuilder('C');
        query.innerJoin(CategoryBrand, 'CB', 'C.id = CB.cat_id');
        query.innerJoin(Brands, 'B', 'B.id = CB.brand_id');
        query.where('C.urlKey = :categoryslug', { categoryslug }).andWhere('CB.isActive = 1');
        return query.select(selects).getRawMany();
    }

    public async getChildsByCategory(siteId: any, langId: any, category: any) {
        const query = getConnection()
          .getRepository(Categories)
          .createQueryBuilder('C')
          .innerJoin(CategoriesML, 'CML', 'C.id = CML.catId')
          .innerJoin(SiteCategories, 'SC', `C.id = SC.catId AND SC.siteId = ${siteId}`)
          .where(`CML.langId = ${langId}`)
          .andWhere('SC.isActive = 1')
          .select(['C.urlKey as slug', 'C.image as image','CML.name as name', 'C.id as id']);
      
        const childCategories = await query.andWhere('C.parent = :parent', { parent: category.catId }).getRawMany();
        return childCategories;
    }

    public async getAllChildrenOfCategory(catId: any) {
        const selects = [
            'CP.id as id',
            'CP.catId as catId',
            'CP.pathId as pathId',
            'CP.level as level',
            'C.parentInt as parent'
        ];
        let children = await getConnection().getRepository(CategoryPath).createQueryBuilder('CP').innerJoin(Categories, 'C', 'C.id = CP.catId').select(selects).where('CP.pathId = :catId', { catId }).getRawMany();
        if (children.length === 1) {
            // It means there is no children for this category and this might be any category refering to any campaign (created as category).
            return children.map(c => c.catId);
        }
        // remove all parent categories
        children = children.filter(i => i.parent != 0);
        // check if category have its children
        const x = await getConnection().getRepository(Categories).createQueryBuilder('C').where('C.parentInt = :cid', { cid: catId }).getMany();
        if (x.length > 0) {
            children = children.filter(i => i.catId != catId);
        }
        if (children.length > 0) {
            const a = children.map(c => c.catId);
            children = await getConnection().getRepository(CategoryPath).createQueryBuilder('CP')
            .where('CP.pathId IN (:...catIds)', { catIds: [...new Set(a)] }).getMany();

        }
        const b = children.map(c => c.catId);
        return [...new Set(b)];
    }

    public async getCompleteCategoryPathByVendorProductId(vendorProductId: number) {
        const leastCategory = await getConnection().getRepository(VendorProductCategory).createQueryBuilder('VPC').where('VPC.vendorProductId = :vendorProductId', { vendorProductId }).orderBy('VPC.id', 'ASC').getOne();
        const categories = await getConnection().getRepository(CategoryPath).createQueryBuilder('CP').where('CP.catId = :catId', { catId: leastCategory.categoryId }).getMany();
        const allCats = await this.categoryFromArrayIds(categories.map(i => i.pathId), 1);
        return allCats;
    }

    public async categoriesPathByCatId(catId: number) {

        const breadcrumbs = [];

        let currentCategory = await this.categoriesRepository.findOne({ where: { id: catId } });

        while (currentCategory) {
            breadcrumbs.unshift(currentCategory);

            if (currentCategory.parentInt) {
                currentCategory = await this.categoriesRepository.findOne({ where: { id: currentCategory.parentInt } });
            } else {
                currentCategory = null;
            }
        }

        const categories = [];
        for (const category of breadcrumbs) {
            const categoryData = await getConnection()
                .getRepository(Categories)
                .createQueryBuilder('C')
                .leftJoin(CategoriesML, 'CML', 'CML.catId = C.id')
                .select([
                    'C.urlKey as categorySlug',
                    'CML.name as name',
                    'CML.metaTitle as metaTitle',
                    'CML.metaKeyword as metaKeyword',
                    'CML.metaDescription as metaDescription',
                    'CML.catId as catId',
                ])
                .where('C.id = :catId', { catId: category.id })
                .getRawOne(); 
            categories.push(categoryData);
        }

        return categories;
    }
}
