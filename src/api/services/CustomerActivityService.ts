import { Service } from 'typedi';
import { Like } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { CustomerActivityRepository } from '../repositories/CustomerActivityRepository';

@Service()
export class CustomerActivityService {

    constructor(
        @OrmRepository() private repo: CustomerActivityRepository) {
    }
     // create customer
     public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }

    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }

      // find Condition
      public findOne(customer: any): Promise<any> {
        return this.repo.findOne(customer);
    }

    public list(limit: any, offset: any, select: any = [], whereConditions: any = [], count: number | boolean): Promise<any> {
        const condition: any = {};

        if (select && select.length > 0) {
            condition.select = select;
        }
        condition.where = {};

        if (whereConditions && whereConditions.length > 0) {
            whereConditions.forEach((table: any) => {
                const operator: string = table.op;
                if (operator === 'where' && table.value !== undefined) {
                    condition.where[table.name] = table.value;
                } else if (operator === 'like' && table.value !== undefined) {
                    condition.where[table.name] = Like('%' + table.value + '%');
                }
            });
        }

        if (limit && limit > 0) {
            condition.take = limit;
            condition.skip = offset;
        }

        if (count) {
            return this.repo.count(condition);
        }
        return this.repo.find(condition);
    }

     // delete customer
     public async delete(id: number): Promise<any> {
        return await this.repo.delete(id);
    }

}
