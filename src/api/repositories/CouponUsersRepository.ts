import { EntityRepository, Repository } from 'typeorm';
import { CouponUser } from '../models/CouponUser';

@EntityRepository(CouponUser)
export class CouponUsersRepository extends Repository<CouponUser>  {

}
