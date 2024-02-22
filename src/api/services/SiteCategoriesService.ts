import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { SiteCategoriesRepository } from '../repositories/SiteCategoriesRepository';

@Service()
export class SiteCategoriesService {

    constructor(
        @OrmRepository() private repo: SiteCategoriesRepository) {
    }

    public async create(customer: any): Promise<any> {
        return this.repo.save(customer);
    }

    // find Condition
    public findOne(customer: any): Promise<any> {
        return this.repo.findOne(customer);
    }

    // find Condition
    public findAll(): Promise<any> {
        return this.repo.find();
    }
    // find Condition
    public find(data: any): Promise<any> {
        return this.repo.find(data);
    }

    public getCategories(siteId: any, parent: any, langId: any, userId: any): Promise<any> {
        return this.repo.getCategories(siteId, parent, langId, userId);
    }
    public getCategoriesV2(siteId: number, langId: number): Promise<any> {
        return this.repo.getCategoriesV2(siteId, langId);
    }
    public getSearchByCategories(siteId: number, langId: number): Promise<any> {
        return this.repo.getSearchByCategories(siteId, langId);
    }
    public getSubCatsofThisCat(catId:number, siteId: number, langId: number): Promise<any> {
        return this.repo.getSubCatsofThisCat(catId, siteId, langId);
    }

    public getSubCatsofTopOfMonth(catId:number, siteId: number, langId: number): Promise<any> {
        return this.repo.getSubCatsofTopOfMonth(catId, siteId, langId);
    }
    
    public topofMonth(siteId: number, langId: number): Promise<any> {
        return this.repo.topofMonth(siteId, langId);
    }
    public featured(siteId: number, langId: number): Promise<any> {
        return this.repo.featured(siteId, langId);
    }
    public categoryBySlug(siteId: number, langId: number, slug: string): Promise<any> {
        return this.repo.categoryBySlug(siteId, langId, slug);
    }
    // update customer
    public update(id: any, customer: any): Promise<any> {
        customer.customerId = id;
        return this.repo.save(customer);
    }
}
