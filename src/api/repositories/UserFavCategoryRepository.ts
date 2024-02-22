import { EntityRepository, Repository } from 'typeorm';
import { UserFavCategory } from '../models/UserFavCategory';

@EntityRepository(UserFavCategory)
export class UserFavCategoryRepository extends Repository<UserFavCategory>  {
}
