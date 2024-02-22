import { EntityRepository, Repository } from 'typeorm';
import { CampaignVendors } from '../models/CampaignVendors';

@EntityRepository(CampaignVendors)
export class CampaignVendorsRepository extends Repository<CampaignVendors>  {

}
