import { EntityRepository, Repository } from 'typeorm';
import { RegionType } from '../models/RegionType';

@EntityRepository(RegionType)
export class RegionTypeRepository extends Repository<RegionType>  {
}
