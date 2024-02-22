import { EntityRepository, Repository } from 'typeorm';
import { Invoices } from '../models/Invoices';

@EntityRepository(Invoices)
export class InvoicesRepository extends Repository<Invoices>  {
}
