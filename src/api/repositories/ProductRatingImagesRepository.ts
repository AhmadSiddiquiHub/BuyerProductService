import { EntityRepository, Repository } from 'typeorm';
import { ProductRatingImages } from '../models/ProductRatingImages';

@EntityRepository(ProductRatingImages)
export class ProductRatingImagesRepository extends Repository<ProductRatingImages>  {
}
