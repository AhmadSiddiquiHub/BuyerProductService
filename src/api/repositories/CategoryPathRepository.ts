import { EntityRepository, Repository } from 'typeorm';
import { CategoryPath } from '../models/CategoryPath';

@EntityRepository(CategoryPath)
export class CategoryPathRepository extends Repository<CategoryPath>  {
}
