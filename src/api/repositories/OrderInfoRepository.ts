import { EntityRepository, Repository } from 'typeorm';
import { OrderInfo } from '../models/OrderInfo';

@EntityRepository(OrderInfo)
export class OrderInfoRepository extends Repository<OrderInfo>  {
}
