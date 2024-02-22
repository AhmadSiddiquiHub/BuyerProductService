import { EntityRepository, Repository } from 'typeorm';
import { Sms } from '../models/Sms';

@EntityRepository(Sms)
export class SmsRepository extends Repository<Sms>  {
}
