import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { CategoryMlRepository } from '../repositories/CategoryMlRepository';

@Service()
export class CategoryMlService {

    constructor(
        @OrmRepository() private repo: CategoryMlRepository) {
    }
     // create customer
     public async create(result: any): Promise<any> {
        return this.repo.save(result);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }
}
