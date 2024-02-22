import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { VariantValuesRepository } from '../repositories/VariantValuesRepository';

@Service()
export class VariantValuesService {

    constructor(
        @OrmRepository() private repo: VariantValuesRepository) {
    }

    public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }
}
