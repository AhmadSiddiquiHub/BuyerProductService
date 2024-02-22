import { EntityRepository, Repository } from 'typeorm';
import { BannerDestType } from '../models/BannerDestType';

@EntityRepository(BannerDestType)
export class BannerDestTypeRepository extends Repository<BannerDestType>  {
}
