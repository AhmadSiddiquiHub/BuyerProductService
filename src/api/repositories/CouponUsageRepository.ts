import { EntityRepository, Repository } from 'typeorm';
import { CouponUsage} from '../models/CouponUsage';

@EntityRepository(CouponUsage)
export class CouponUsageRepository extends Repository<CouponUsage>  {

}
