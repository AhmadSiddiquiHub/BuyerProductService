import { EntityRepository, Repository } from 'typeorm';
import { Roles } from '../models/Roles';

@EntityRepository(Roles)
export class RolesRepository extends Repository<Roles>  {
}
