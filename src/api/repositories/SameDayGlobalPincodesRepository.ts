import { EntityRepository, Repository } from 'typeorm';
import { SameDayGlobalPincodes } from '../models/SameDayGlobalPincodes';

@EntityRepository(SameDayGlobalPincodes)
export class SameDayGlobalPincodesRepository extends Repository<SameDayGlobalPincodes>  {
}
