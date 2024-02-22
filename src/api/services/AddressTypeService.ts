import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { AddressTypeRepository } from '../repositories/AddressTypeRepository';

@Service()
export class AddressTypeService {

    constructor(
        @OrmRepository() private addressTypeRepository: AddressTypeRepository) {
    }
     // create customer
     public async create(result: any): Promise<any> {
        return this.addressTypeRepository.save(result);
    }
}
