import { EntityRepository, Repository } from 'typeorm';
import { CouponProduct} from '../models/CouponProduct';

@EntityRepository(CouponProduct)
export class CouponProductsRepository extends Repository<CouponProduct>  {

}
