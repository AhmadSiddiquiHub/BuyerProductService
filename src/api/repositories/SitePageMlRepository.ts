import { EntityRepository, Repository } from 'typeorm';
import { SitePageMl } from '../models/SitePageMl';

@EntityRepository(SitePageMl)
export class SitePageMlRepository extends Repository<SitePageMl>  {
}
