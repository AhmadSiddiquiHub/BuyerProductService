import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { SiteBannersRepository } from '../repositories/SiteBannersRepository';

@Service()
export class SiteBannerService {

    constructor(
        @OrmRepository() private repo: SiteBannersRepository) {
    }

    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }

}
