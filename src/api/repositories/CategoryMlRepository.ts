import { EntityRepository, Repository } from 'typeorm';
import { CategoriesML } from '../models/CategoriesML';

@EntityRepository(CategoriesML)
export class CategoryMlRepository extends Repository<CategoriesML>  {
}
