import { EntityRepository, Repository } from 'typeorm';
import { EmailMl } from '../models/EmailMl';

@EntityRepository(EmailMl)
export class EmailMlRepository extends Repository<EmailMl>  {
}
