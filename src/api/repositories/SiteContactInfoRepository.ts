import { EntityRepository, Repository } from 'typeorm';
import { SiteContactInfo } from '../models/SiteContactInfo';

@EntityRepository(SiteContactInfo)
export class SiteContactInfoRepository extends Repository<SiteContactInfo>  {
}
