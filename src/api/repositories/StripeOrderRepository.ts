import { EntityRepository, Repository } from 'typeorm';
import { StripeOrder } from '../models/StripeOrder';

@EntityRepository(StripeOrder)
export class StripeOrderRepository extends Repository<StripeOrder>  {

}
