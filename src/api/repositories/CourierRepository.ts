import { EntityRepository, Repository } from 'typeorm';
import { Courier } from '../models/Courier';

@EntityRepository(Courier)
export class CourierRepository extends Repository<Courier>  {
}
