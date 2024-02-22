import { EntityRepository, Repository } from 'typeorm';
import { ComboOfferProducts } from '../models/ComboOfferProduct';

@EntityRepository(ComboOfferProducts)
export class ComboOfferProductsRepository extends Repository<ComboOfferProducts>  {

}
