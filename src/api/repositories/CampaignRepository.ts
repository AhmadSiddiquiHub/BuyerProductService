import { EntityRepository, Repository } from 'typeorm';
import { Campaign } from '../models/Campaign';

@EntityRepository(Campaign)
export class CampaignRepository extends Repository<Campaign>  {
}
