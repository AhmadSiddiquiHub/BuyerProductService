import { EntityRepository, Repository } from 'typeorm';
import { PaypalOrder } from '../models/PaypalOrder';

@EntityRepository(PaypalOrder)
export class PaypalOrderRepository extends Repository<PaypalOrder>  {

}
