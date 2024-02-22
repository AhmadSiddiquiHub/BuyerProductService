import { EntityRepository, Repository } from 'typeorm';
import { OrderPreference } from '../models/OrderPreference';

@EntityRepository(OrderPreference)
export class OrderPreferenceRepository extends Repository<OrderPreference>  {
}
