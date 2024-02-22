import { EntityRepository, Repository } from 'typeorm';
import { UserBrowsingHistory } from '../models/UserBrowsingHistory';

@EntityRepository(UserBrowsingHistory)
export class UserBrowsingHistoryRepository extends Repository<UserBrowsingHistory>  {
}
