import { EntityRepository, Repository } from 'typeorm';
import { Vendor } from '../models/Vendor';

@EntityRepository(Vendor)
export class VendorRepository extends Repository<Vendor>  {
}
