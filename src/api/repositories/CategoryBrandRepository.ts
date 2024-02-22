import { EntityRepository, Repository } from 'typeorm';
import { CategoryBrand } from '../models/CategoryBrand';

@EntityRepository(CategoryBrand)
export class CategoryBrandRepository extends Repository<CategoryBrand>  {
}
