import { EntityRepository, Repository } from 'typeorm';
import { Countries } from '../models/Countries';

@EntityRepository(Countries)
export class CountriesRepository extends Repository<Countries>  {
}
