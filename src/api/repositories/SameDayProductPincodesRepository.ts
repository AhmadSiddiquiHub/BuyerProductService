import { EntityRepository, Repository } from 'typeorm';
import { SameDayProductPincodes } from '../models/SameDayProductPincodes';

@EntityRepository(SameDayProductPincodes)
export class SameDayProductPincodesRepository extends Repository<SameDayProductPincodes>  {
}
