import { EntityRepository, Repository } from 'typeorm';
import { ProductMetaInfo } from '../models/ProductMetaInfo';

@EntityRepository(ProductMetaInfo)
export class ProductMetaInfoRepository extends Repository<ProductMetaInfo>  {
}
