
import { EntityRepository, Repository } from 'typeorm';
import { OrderCancelReasons } from '../models/OrderCancelReasons';

@EntityRepository(OrderCancelReasons)
export class OrderCancelReasonsRepository extends Repository<OrderCancelReasons>  {

}
