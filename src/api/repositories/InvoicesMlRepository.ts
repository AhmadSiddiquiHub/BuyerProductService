import { EntityRepository, Repository } from 'typeorm';
import { InvoicesMl } from '../models/InvoicesMl';

@EntityRepository(InvoicesMl)
export class InvoicesMlRepository extends Repository<InvoicesMl>  {
}
