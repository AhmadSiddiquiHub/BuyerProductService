import { EntityRepository, Repository } from 'typeorm';
import { ApiList } from '../models/ApiList';

@EntityRepository(ApiList)
export class ApiListRepository extends Repository<ApiList>  {
}
