import { EntityRepository, Repository } from 'typeorm';
import { ProductTax } from '../models/ProductTax';
@EntityRepository(ProductTax)
export class ProductTaxRepository extends Repository<ProductTax>  {
}
