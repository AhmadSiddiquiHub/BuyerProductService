import { EntityRepository, Repository } from 'typeorm';
import { ProductVariantValue } from '../models/ProductVariantValue';

@EntityRepository(ProductVariantValue)
export class ProductVariantValueRepository extends Repository<ProductVariantValue>  {
}
