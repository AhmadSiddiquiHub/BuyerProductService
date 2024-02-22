import { EntityRepository, Repository } from 'typeorm';
import { Emails } from '../models/Emails';

@EntityRepository(Emails)
export class EmailsRepository extends Repository<Emails>  {
}
