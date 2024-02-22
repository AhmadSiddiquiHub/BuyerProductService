import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { SitePageMlRepository } from '../repositories/SitePageMlRepository';

@Service()
export class SitePageMlService {

    constructor(
        @OrmRepository() private repo: SitePageMlRepository) {
    }

    public async create(customer: any): Promise<any> {
        return this.repo.save(customer);
    }

    // find Condition
    public findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
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
