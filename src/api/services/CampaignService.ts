import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { CampaignRepository } from '../repositories/CampaignRepository';
import { Campaign } from '../models/Campaign';
import { getConnection  } from 'typeorm';
@Service()
export class CampaignService {

    constructor(@OrmRepository() private repo: CampaignRepository) {
    }

    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }

    public async activeCampaign(slug: string): Promise<any> {
        const selects = [
            'C.id as id',
            'C.campaignName as campaignName',
            'C.slug as slug',
            'C.startDate as startDate',
            'C.endDate as endDate',
            'C.isActive as isActive',
            'C.mainPageBanner as mainPageBanner',
            'C.vendorRegBanner as vendorRegBanner',
            'C.metaTitle as metaTitle',
            'C.metaKeyword as metaKeyword',
            'C.metaDescription as metaDescription',
        ];
        const query = await getConnection().getRepository(Campaign).createQueryBuilder('C')
        .select(selects)
        .andWhere('NOW() BETWEEN C.startDate AND C.endDate')
        .where('C.slug = :slug', { slug })
        .andWhere('C.isActive = 1');
        return query.getRawOne();
    }
}
