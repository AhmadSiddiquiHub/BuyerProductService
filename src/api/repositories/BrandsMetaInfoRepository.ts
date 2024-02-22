import { EntityRepository, Repository } from 'typeorm';
import { BrandsMetaInfo } from '../models/BrandsMetaInfo';

@EntityRepository(BrandsMetaInfo)
export class BrandsMetaInfoRepository extends Repository<BrandsMetaInfo>  {
}
