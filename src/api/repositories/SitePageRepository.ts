import { EntityRepository, Repository } from 'typeorm';
import { SitePage } from '../models/SitePage';

@EntityRepository(SitePage)
export class SitePageRepository extends Repository<SitePage>  {
}
