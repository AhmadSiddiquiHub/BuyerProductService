import { EntityRepository, Repository } from 'typeorm';
import { ProductQuestions } from '../models/ProductQuestions';

@EntityRepository(ProductQuestions)
export class ProductQuestionsRepository extends Repository<ProductQuestions>  {

}
