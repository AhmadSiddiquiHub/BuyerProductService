import { EntityRepository, Repository } from 'typeorm';
import { Categories } from '../models/Categories';

@EntityRepository(Categories)
export class CategoriesRepository extends Repository<Categories>  {
}
