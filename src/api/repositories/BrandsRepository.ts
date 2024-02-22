import { EntityRepository, Repository } from 'typeorm';
import { Brands } from '../models/Brands';

@EntityRepository(Brands)
export class BrandsRepository extends Repository<Brands>  {
}
