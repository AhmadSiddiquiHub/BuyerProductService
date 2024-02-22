import { EntityRepository, Repository } from 'typeorm';
import { VendorProduct } from '../models/VendorProduct';

@EntityRepository(VendorProduct)
export class VendorProductRepository extends Repository<VendorProduct>  {
}
