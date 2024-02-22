import { EntityRepository, Repository } from 'typeorm';
import { ProductInfo } from '../models/ProductInfo';

@EntityRepository(ProductInfo)
export class ProductInfoRepository extends Repository<ProductInfo>  {
}
