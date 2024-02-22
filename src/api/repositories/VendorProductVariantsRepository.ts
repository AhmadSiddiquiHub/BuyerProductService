import { EntityRepository, Repository } from 'typeorm';
import { VendorProductVariants } from '../models/VendorProductVariants';

@EntityRepository(VendorProductVariants)
export class VendorProductVariantsRepository extends Repository<VendorProductVariants>  {
}
