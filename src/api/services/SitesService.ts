import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { SitesRepository } from '../repositories/SitesRepository';

@Service()
export class SitesService {

    constructor(@OrmRepository() private repo: SitesRepository) {
    }
    public findOne(condtition: any): Promise<any> {
        return this.repo.findOne(condtition);
    }
    public async getSites(): Promise<any> {
        return this.repo.getSites();
    }
    public async vendorMarketplaces(userId: number): Promise<any> {
        return this.repo.vendorMarketplaces(userId);
    }
    public async siteDataForFooterApiHomePage(siteId: number): Promise<any> {
        return this.repo.siteDataForFooterApiHomePage(siteId);
    }
}
