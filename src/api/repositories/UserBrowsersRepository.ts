import { EntityRepository, Repository } from 'typeorm';
import { UserBrowsers } from '../models/UserBrowsers';

@EntityRepository(UserBrowsers)
export class UserBrowsersRepository extends Repository<UserBrowsers>  {
}
