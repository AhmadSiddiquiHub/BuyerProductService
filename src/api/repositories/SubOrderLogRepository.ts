import { EntityRepository, Repository } from 'typeorm';
import { SubOrderLog } from '../models/SubOrderLog';

@EntityRepository(SubOrderLog)
export class SubOrderLogRepository extends Repository<SubOrderLog>  {
}
