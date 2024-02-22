import { EntityRepository, Repository } from 'typeorm';
import { CampaignUsers } from '../models/CampaignUsers';

@EntityRepository(CampaignUsers)
export class CampaignUsersRepository extends Repository<CampaignUsers>  {

}
