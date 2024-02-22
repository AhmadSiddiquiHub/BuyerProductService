import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { CategoryPathRepository } from '../repositories/CategoryPathRepository';

@Service()
export class CategoryPathService {

    constructor(
        @OrmRepository() private repo: CategoryPathRepository) {
    }
     // create customer
     public async create(result: any): Promise<any> {
        return this.repo.save(result);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }
    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }
}
