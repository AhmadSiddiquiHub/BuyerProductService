import { EntityRepository, Repository } from 'typeorm';
import { CampaignProducts } from '../models/CampaignProducts';

@EntityRepository(CampaignProducts)
export class CampaignProductsRepository extends Repository<CampaignProducts>  {

}
