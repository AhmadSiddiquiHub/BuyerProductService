import { EntityRepository, Repository } from 'typeorm';
import { OpenBoxSubscription } from '../models/OpenBoxSubscription';

@EntityRepository(OpenBoxSubscription)
export class OpenBoxSubscriptionRepository extends Repository<OpenBoxSubscription>  {

}
