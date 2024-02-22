import { EntityRepository, Repository } from 'typeorm';
import { Sessions } from '../models/Sessions';

@EntityRepository(Sessions)
export class SessionsRepository extends Repository<Sessions>  {
}
