import { EntityRepository, Repository } from 'typeorm';
import { SiteUser } from '../models/SiteUser';

@EntityRepository(SiteUser)
export class SiteUserRepository extends Repository<SiteUser>  {
}
