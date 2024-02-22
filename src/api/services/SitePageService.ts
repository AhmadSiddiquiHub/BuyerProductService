import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { SitePageRepository } from '../repositories/SitePageRepository';

@Service()
export class SitePageService {

    constructor(
        @OrmRepository() private repo: SitePageRepository) {
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

    
}
