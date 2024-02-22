import { EntityRepository, Repository } from 'typeorm';
import { ReasonType } from '../models/ReasonType';

@EntityRepository(ReasonType)
export class ReasonTypeRepository extends Repository<ReasonType>  {

}