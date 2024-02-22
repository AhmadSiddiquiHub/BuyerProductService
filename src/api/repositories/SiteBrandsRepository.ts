import { EntityRepository, Repository } from 'typeorm';
import { SiteBrands } from '../models/SiteBrand';

@EntityRepository(SiteBrands)
export class SiteBrandsRepository extends Repository<SiteBrands> {
}
