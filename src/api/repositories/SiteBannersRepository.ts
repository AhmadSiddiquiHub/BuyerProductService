import { EntityRepository, Repository } from 'typeorm';
import { SiteBanners } from '../models/SiteBanners';

@EntityRepository(SiteBanners)
export class SiteBannersRepository extends Repository<SiteBanners>  {
}
