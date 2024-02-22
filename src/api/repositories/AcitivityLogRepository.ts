import { EntityRepository, Repository } from 'typeorm';
import { ActivityLog } from '../models/ActivityLog';

@EntityRepository(ActivityLog)
export class ActivityLogRepository extends Repository<ActivityLog>  {
}
