import { EntityRepository, Repository } from 'typeorm';
import { ProductShippingInfo } from '../models/ProductShippingInfo';

@EntityRepository(ProductShippingInfo)
export class ProductShippingInfoRepository extends Repository<ProductShippingInfo>  {
}
