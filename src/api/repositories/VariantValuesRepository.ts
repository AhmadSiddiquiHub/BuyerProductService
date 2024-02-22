import { EntityRepository, Repository } from 'typeorm';
import { VariantValues } from '../models/VariantValues';

@EntityRepository(VariantValues)
export class VariantValuesRepository extends Repository<VariantValues>  {
}
