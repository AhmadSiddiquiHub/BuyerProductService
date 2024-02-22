import { EntityRepository, Repository } from 'typeorm';
import { VendorProductStatusLog } from '../models/VendorProductStatusLog';

@EntityRepository(VendorProductStatusLog)
export class VendorProductStatusLogRepository extends Repository<VendorProductStatusLog>  {
}
