import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { VendorOrderPreferenceRepository } from '../repositories/VendorOrderPreferenceRepository';

@Service()
export class VendorOrderPreferenceService {

    constructor(
        @OrmRepository() private repo: VendorOrderPreferenceRepository) {
    }
    public async create(result: any): Promise<any> {
        return this.repo.save(result);
    }
    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }
    public async delete(id: any): Promise<any> {
        return await this.repo.delete(id);
    }
}
