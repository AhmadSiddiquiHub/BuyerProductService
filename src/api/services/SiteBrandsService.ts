import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { SiteBrandsRepository } from '../repositories/SiteBrandsRepository';

@Service()
export class SiteBrandsService {

    constructor(
        @OrmRepository() private repo: SiteBrandsRepository) {
    }
    public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }
    public find(data: any): Promise<any> {
        return this.repo.find(data);
    }
    public async delete(id: number): Promise<any> {
        return await this.repo.delete(id);
    }
}
