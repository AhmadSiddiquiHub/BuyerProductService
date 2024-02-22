import { EntityRepository, Repository } from 'typeorm';
import { ComboOffer } from '../models/ComboOffer';

@EntityRepository(ComboOffer)
export class ComboOfferRepository extends Repository<ComboOffer>  {

}
