import { EntityRepository, Repository } from 'typeorm';
import { NewsLetter } from '../models/NewsLetter';

@EntityRepository(NewsLetter)
export class NewsLetterRepository extends Repository<NewsLetter>  {

}
