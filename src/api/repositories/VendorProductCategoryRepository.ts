import { EntityRepository, Repository } from 'typeorm';
import { VendorProductCategory } from '../models/VendorProductCategory';

@EntityRepository(VendorProductCategory)
export class VendorProductCategoryRepository extends Repository<VendorProductCategory>  {
}
