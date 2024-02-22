import { EntityRepository, Repository } from 'typeorm';
import { ProductVariants } from '../models/ProductVariants';

@EntityRepository(ProductVariants)
export class ProductVariantsRepository extends Repository<ProductVariants>  {
}
