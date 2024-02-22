import { EntityRepository, Repository } from 'typeorm';
import { ProductRatingVideos } from '../models/ProductRatingVideos';

@EntityRepository(ProductRatingVideos)
export class ProductRatingVideosRepository extends Repository<ProductRatingVideos>  {
}
