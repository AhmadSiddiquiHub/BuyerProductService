import { EntityRepository, Repository } from 'typeorm';
import { Customer } from '../models/Customer';

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer>  {
}
