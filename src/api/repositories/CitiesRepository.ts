import { EntityRepository, Repository } from 'typeorm';
import { Cities } from '../models/Cities';

@EntityRepository(Cities)
export class CitiesRepository extends Repository<Cities>  {
}
