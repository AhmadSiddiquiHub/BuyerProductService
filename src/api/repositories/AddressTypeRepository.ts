import { EntityRepository, Repository } from 'typeorm';
import { AddressType } from '../models/AddressType';

@EntityRepository(AddressType)
export class AddressTypeRepository extends Repository<AddressType>  {
}
