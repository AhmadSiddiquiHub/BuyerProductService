import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { RegionTypeRepository } from '../repositories/RegionTypeRepository';
import {Categories} from '../models/Categories';

@Service()
export class RegionTypeServices {

    constructor(
        @OrmRepository() private repo: RegionTypeRepository) {
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
}
