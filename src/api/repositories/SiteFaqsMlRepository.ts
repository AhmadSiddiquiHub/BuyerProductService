import { EntityRepository, Repository } from 'typeorm';
import { SiteFaqsMl } from '../models/SiteFaqsMl';

@EntityRepository(SiteFaqsMl)
export class SiteFaqsMlRepository extends Repository<SiteFaqsMl>  {
}
