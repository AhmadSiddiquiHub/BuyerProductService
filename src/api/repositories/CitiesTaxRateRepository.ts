import { EntityRepository, Repository } from 'typeorm';
import { CitiesTaxRate } from '../models/CitiesTaxRate';

@EntityRepository(CitiesTaxRate)
export class CitiesTaxRateRepository extends Repository<CitiesTaxRate>  {
}
