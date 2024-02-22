import { EntityRepository, Repository } from 'typeorm';
import { SubOrderTracking } from '../models/SubOrderTracking';

@EntityRepository(SubOrderTracking)
export class SubOrderTrackingRepository extends Repository<SubOrderTracking>  {
}
