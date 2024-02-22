import { EntityRepository, Repository } from 'typeorm';
import { VendorStoreProfile } from '../models/VendorStoreProfile';

@EntityRepository(VendorStoreProfile)
export class VendorStoreProfileRepository extends Repository<VendorStoreProfile>  {
}
