import { EntityRepository, Repository } from 'typeorm';
import { UserTypes } from '../models/UserTypes';

@EntityRepository(UserTypes)
export class UserTypesRepository extends Repository<UserTypes>  {
}
