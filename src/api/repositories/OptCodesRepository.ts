import { EntityRepository, Repository } from 'typeorm';
import { OtpCodes } from '../models/OtpCodes';

@EntityRepository(OtpCodes)
export class OtpCodesRepository extends Repository<OtpCodes>  {
}
