import { EntityRepository, Repository } from 'typeorm';
import { RelatedProducts } from '../models/RelatedProducts';

@EntityRepository(RelatedProducts)
export class RelatedProductsRepository extends Repository<RelatedProducts>  {
}
