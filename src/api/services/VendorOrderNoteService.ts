import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { VendorOrderNoteRepository } from '../repositories/VendorOrderNoteRepository';

@Service()
export class VendorOrderNoteService {

    constructor(
        @OrmRepository() private repo: VendorOrderNoteRepository) {
    }

    public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }
    public async update(id: any, notes: any): Promise<any> {
        notes.id = id;
        return this.repo.save(notes);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.findOne(condition);
    }
}
