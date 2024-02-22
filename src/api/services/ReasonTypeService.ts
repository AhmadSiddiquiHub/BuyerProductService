import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ReasonTypeRepository } from '../repositories/ReasonTypeRepository';

@Service()
export class ReasonTypeService {

    constructor(
        @OrmRepository() private repo: ReasonTypeRepository
    ) {}

    public async find(condition: any): Promise<any> {
        return this.repo.save(condition);
    }
}
