import { EntityRepository, Repository } from 'typeorm';
import { UserWishlist } from '../models/UserWishList';

@EntityRepository(UserWishlist)
export class UserWishlistRepository extends Repository<UserWishlist>  {
}
