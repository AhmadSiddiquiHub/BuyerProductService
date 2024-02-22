import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { RegionRepository } from '../repositories/RegionRepository';
import {Categories} from '../models/Categories';
import { getConnection, Like } from 'typeorm';
import { CategoryBrand } from '../models/CategoryBrand';
import { Brands } from '../models/Brands';

@Service()
export class ShippingRegionService {

    constructor(
        @OrmRepository() private repo: RegionRepository) {
    }
     // create region
    public async create(region: any): Promise<Categories> {
        return this.repo.save(region);
    }
    // findone region
    public findOne(region: any): Promise<any> {
        return this.repo.findOne(region);
    }
  // delete Category
    public async delete(id: number): Promise<any> {
        await this.repo.delete(id);
        return;
    }
  // RegionList
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
            return this.repo.count(condition);
        }
        return this.repo.find(condition);
    }

    public listing(whereConditions: any = []): Promise<any> {
        const condition: any = {};
        condition.where = {};
        if (whereConditions && whereConditions.length > 0) {
            whereConditions.forEach((item: any) => {
                condition.where[item.name] = item.value;
            });
        }
        return this.repo.find(condition);
    }

    // find region
    public find(region: any): Promise<any> {
        return this.repo.find(region);
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
}
