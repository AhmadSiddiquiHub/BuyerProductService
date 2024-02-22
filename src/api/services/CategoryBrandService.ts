import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { CategoryBrandRepository } from '../repositories/CategoryBrandRepository';

@Service()
export class CategoryBrandService {

    constructor(
        @OrmRepository() private categoryBrandRepository: CategoryBrandRepository) {
    }
     // create customer
     public async create(result: any): Promise<any> {
        return this.categoryBrandRepository.save(result);
    }
}
