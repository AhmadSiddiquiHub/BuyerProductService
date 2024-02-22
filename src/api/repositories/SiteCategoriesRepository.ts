import { EntityRepository, Repository } from 'typeorm';
import { Categories } from '../models/Categories';
import { CategoriesML } from '../models/CategoriesML';
import { SiteCategories } from '../models/SiteCategories';
import { UserFavCategory } from '../models/UserFavCategory';
import SectionProducts from '../models/SectionProducts';
// import { VendorProductCategory } from '../models/VendorProductCategory';

@EntityRepository(SiteCategories)
export class SiteCategoriesRepository extends Repository<SiteCategories>  {

    public async getCategories(siteId: any, parent: any, langId: any, userId: any): Promise<any> {
        const selects = [
            'siteCat.cat_id as categoryId',
            'cat.urlKey as categorySlug',
            'cat.urlKey as slug',
            'cat.icon as icon',
            'cat.image as image',
            'cat.parent as parent',
            'catMl.name as name',
        ];
        if (userId !== null) {
            selects.push('user_fav_cat.id as isFavourite');
        }
        const query: any = await this.manager.createQueryBuilder(SiteCategories, 'siteCat');
        query.select(selects);
        query.innerJoin(Categories, 'cat', 'cat.id = siteCat.cat_id');
        query.innerJoin(CategoriesML, 'catMl', 'catMl.catId = siteCat.cat_id');
        query.where('siteCat.site_id= :id', { id: siteId });
        query.andWhere('catMl.lang_id = :langId', { langId });
        if (parent !== null) {
            query.andWhere('cat.parent= :parent', { parent });
        }
        if (userId !== null) {
            query.leftJoin(UserFavCategory, 'user_fav_cat', 'user_fav_cat.catId = cat.id and user_fav_cat.user_id = :userId and user_fav_cat.site_id = :siteId', { userId, siteId });
        }
        return query.getRawMany();
    }

    public async getCategoriesV2(siteId: any, langId: any): Promise<any> {
        const selects = [
            'SC.cat_id as categoryId',
            'CML.name as name',
            'C.urlKey as categorySlug',
            'C.urlKey as slug',
            'C.icon as icon',
            'C.image as image',
            'C.parent as parent',
            'C.sortOrder as sortOrder',
            'SC.isActive as isActive',
        ];
        const query: any = await this.manager.createQueryBuilder(SiteCategories, 'SC')
        .innerJoin(Categories, 'C', 'C.id = SC.cat_id')
        .innerJoin(CategoriesML, 'CML', 'CML.catId = SC.cat_id')
        // .innerJoin(VendorProductCategory, 'VPC', 'VPC.categoryId = SC.cat_id')
        .select(selects)
        .where('SC.site_id= :siteId', { siteId }).andWhere('SC.showInMenu = 1').andWhere('SC.isActive = 1') 
        .andWhere('CML.lang_id = :langId', { langId })
        .orderBy('C.sortOrder', 'ASC');
        return query.getRawMany();
    }

    public async getSearchByCategories(siteId: any, langId: any): Promise<any> {
        const selects = [
            'SC.cat_id as categoryId',
            'CML.name as name',
            'C.urlKey as categorySlug',
            'C.urlKey as slug',
            'C.icon as icon',
            'C.image as image',
            'C.parent as parent',
            'C.sortOrder as sortOrder',
            'SC.isActive as isActive',
        ];
        const query: any = await this.manager.createQueryBuilder(SiteCategories, 'SC')
        .innerJoin(Categories, 'C', 'C.id = SC.cat_id')
        .innerJoin(CategoriesML, 'CML', 'CML.catId = SC.cat_id')
        .select(selects)
        .where('SC.site_id= :siteId', { siteId })
        .andWhere('SC.isActive = 1') 
        .andWhere('C.parent = 0') 
        .andWhere('CML.lang_id = :langId', { langId })
        .orderBy('CML.name', 'ASC');
        return query.getRawMany();
    }

    public async getSubCatsofThisCat(catId:any, siteId: any, langId: any): Promise<any> {
        const selects = [
            'SC.cat_id as categoryId',
            'CML.name as name',
            'C.urlKey as categorySlug',
            'C.urlKey as slug',
            'C.icon as icon',
            'C.image as image',
            'C.parent as parent',
            'SC.isActive as isActive',
            'SC.topOfMonth as topOfMonth',
        ];
        const query: any = await this.manager.createQueryBuilder(SiteCategories, 'SC')
        .innerJoin(Categories, 'C', 'C.id = SC.cat_id')
        .innerJoin(CategoriesML, 'CML', 'CML.catId = SC.cat_id')
        .select(selects)
        .where('SC.site_id= :siteId', { siteId }).andWhere('SC.showInMenu = 1').andWhere('SC.isActive = 1')
        .andWhere('CML.lang_id = :langId', { langId })
        .andWhere('C.parent = :catId', { catId });
        return query.getRawMany();
    }

      public async getSubCatsofTopOfMonth(catId: any, siteId: any, langId: any): Promise<any[]> {
        const selects = [
          'SC.cat_id as categoryId',
          'CML.name as name',
          'C.urlKey as categorySlug',
          'C.urlKey as slug',
          'C.icon as icon',
          'C.image as image',
          'C.parent as parent',
          'SC.isActive as isActive',
          'SC.topOfMonth as topOfMonth',
        ];
        const query: any = await this.manager
          .createQueryBuilder(SiteCategories, 'SC')
          .innerJoin(Categories, 'C', 'C.id = SC.cat_id')
          .innerJoin(CategoriesML, 'CML', 'CML.catId = SC.cat_id')
          .select(selects)
          .where('SC.site_id= :siteId', { siteId })
          .andWhere('SC.showInMenu = 1')
          .andWhere('SC.isActive = 1')
          .andWhere('SC.topOfMonth = 1')
          .andWhere('CML.lang_id = :langId', { langId })
          .andWhere('C.parent = :catId', { catId })
          .getRawMany();
      
        const getChildren = async (categoryId: number): Promise<any[]> => {
          const childrenQuery = await this.getSubCatsofTopOfMonth(categoryId, siteId, langId);
          const children = [];
      
          for (const child of childrenQuery) {
            const childCategory = { ...child };
            children.push(childCategory, ...(await getChildren(child.categoryId)));
          }
          return children;
        };
        const result: any[] = [];
        for (const category of query) {
          const topLevelCategory = { ...category };
          result.push(topLevelCategory, ...(await getChildren(category.categoryId)));
        }
      
        return result;
      }
    public async filterCategories(siteId: number, langId: number, type: string): Promise<any> {
        const selects = [
            'SC.cat_id as categoryId',
            'CML.name as name',
            'C.urlKey as categorySlug',
            'C.urlKey as slug',
            'C.icon as icon',
            'C.image as image',
            'C.parent as parent',
            'SP.sort_order as section_products_sort_order',
            'C.sort_order as category_sort_order'
        ];
        const query: any = await this.manager.createQueryBuilder(SiteCategories, 'SC')
        .innerJoin(Categories, 'C', 'C.id = SC.cat_id')
        .innerJoin(CategoriesML, 'CML', 'CML.catId = SC.cat_id')
        .leftJoin(SectionProducts, 'SP', 'C.id = SP.category_id')
        .select(selects)
        .where('SC.site_id= :siteId', { siteId })
        .andWhere('SC.isActive = 1')
        .andWhere('CML.lang_id = :langId', { langId });
        if (type === 'topOfMonth') {
            query.andWhere('SC.topOfMonth = 1')
        }
        if (type === 'featured') {
            query.andWhere('SC.featured = 1')
            query.orderBy("COALESCE(NULLIF(C.sort_order, 0), 999999999, C.sort_order)", "ASC");
        }else{
            query.orderBy("SP.sort_order", "ASC");
        }
        // query.andWhere('C.parent = 0')
        return query.getRawMany();
    }
    
    public async featured(siteId: any, langId: any): Promise<any> {
        return await this.filterCategories(siteId, langId, 'featured');
    }
    public async topofMonth(siteId: any, langId: any): Promise<any> {
        return await this.filterCategories(siteId, langId, 'topOfMonth');
    }
    public async categoryBySlug(siteId: number, langId: number, slug: string): Promise<any> {
        const selects = [
            'SC.cat_id as categoryId',
            'C.urlKey as categorySlug',
            'C.urlKey as slug',
            'C.icon as icon',
            'C.image as image',
            'C.parent as parent',
            'CML.name as name',
            'CML.metaTitle as metaTitle',
            'CML.metaKeyword as metaKeyword',
            'CML.metaDescription as metaDescription',
        ];
        return this.manager.createQueryBuilder(SiteCategories, 'SC').select(selects)
        .innerJoin(Categories, 'C', 'C.id = SC.cat_id')
        .innerJoin(CategoriesML, 'CML', 'CML.catId = SC.cat_id')
        .where('SC.site_id= :siteId', { siteId })
        .andWhere('CML.lang_id = :langId', { langId })
        .andWhere('C.urlKey = :slug', { slug })
        .getRawOne();
    }
}
