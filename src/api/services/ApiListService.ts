import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ApiListRepository } from '../repositories/ApiListRepository';

@Service()
export class ApiListService {

    constructor(
        @OrmRepository() private apiListRepository: ApiListRepository) {
    }
     // create customer
     public async create(result: any): Promise<any> {
        return this.apiListRepository.save(result);
    }
}
