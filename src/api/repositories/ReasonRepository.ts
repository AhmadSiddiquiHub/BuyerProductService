import { EntityRepository, Repository } from 'typeorm';
import { Reason } from '../models/Reason';

@EntityRepository(Reason)
export class ReasonRepository extends Repository<Reason>  {

}