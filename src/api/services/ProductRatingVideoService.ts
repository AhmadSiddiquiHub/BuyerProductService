import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ProductRatingVideosRepository } from '../repositories/ProductRatingVideosRepository';

@Service()
export class ProductRatingVideoService {

    constructor(@OrmRepository() private repo: ProductRatingVideosRepository) {
    }

    // find one condition
    public findOne(rating: any): Promise<any> {
        return this.repo.findOne(rating);
    }

    // find all rating
    public findAll(rating: any): Promise<any> {
        return this.repo.find(rating);
    }
    public find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }
    public async create(result: any): Promise<any> {
        return this.repo.save(result);
    }

}
