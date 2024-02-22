import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { VariantsRepository } from '../repositories/VariantsRepository';

@Service()
export class VariantsService {

    constructor(
        @OrmRepository() private repo: VariantsRepository) {
    }
    public async findByIds(array: [number]): Promise<any> {
        return this.repo.findByIds(array);
    }
}
