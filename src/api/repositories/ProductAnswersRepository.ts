
import { EntityRepository, Repository } from 'typeorm';
import { ProductAnswers } from '../models/ProductAnswers';

@EntityRepository(ProductAnswers)
export class ProductAnswersRepository extends Repository<ProductAnswers>  {

}
