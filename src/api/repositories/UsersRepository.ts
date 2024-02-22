import { EntityRepository, Repository } from 'typeorm';
import { Users } from '../models/Users';

@EntityRepository(Users)
export class UsersRepository extends Repository<Users>  {
}
