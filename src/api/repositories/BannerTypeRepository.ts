import { EntityRepository, Repository } from 'typeorm';
import { BannerType } from '../models/BannerType';

@EntityRepository(BannerType)
export class BannerTypeRepository extends Repository<BannerType>  {
}
