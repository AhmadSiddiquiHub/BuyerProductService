import { EntityRepository, Repository } from 'typeorm';
import { VendorOrderPreference } from '../models/VendorOrderPreference';

@EntityRepository(VendorOrderPreference)
export class VendorOrderPreferenceRepository extends Repository<VendorOrderPreference>  {
}
