import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ProductRatingImagesRepository } from '../repositories/ProductRatingImagesRepository';

@Service()
export class ProductRatingImageService {

    constructor(@OrmRepository() private repo: ProductRatingImagesRepository) {
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
