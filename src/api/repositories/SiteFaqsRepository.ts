import { EntityRepository, Repository } from 'typeorm';
import { SiteFaqs } from '../models/SiteFaqs';

@EntityRepository(SiteFaqs)
export class SiteFaqsRepository extends Repository<SiteFaqs>  {
}
