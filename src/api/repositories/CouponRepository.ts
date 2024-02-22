import { EntityRepository, Repository } from 'typeorm';
import { Coupon } from '../models/Coupon';

@EntityRepository(Coupon)
export class VendorCouponRepository extends Repository<Coupon>  {
}
