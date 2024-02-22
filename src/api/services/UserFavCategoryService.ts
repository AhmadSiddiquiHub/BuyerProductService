import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { UserFavCategoryRepository } from '../repositories/UserFavCategoryRepository';

@Service()
export class UserFavCategoryService {

    constructor(
        @OrmRepository() private repo: UserFavCategoryRepository) {
    }
    public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }
    public async delete(id: number): Promise<any> {
        return await this.repo.delete(id);
    }
}
