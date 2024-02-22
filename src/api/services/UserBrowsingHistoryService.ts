import { Service } from 'typedi';
import { Like } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { UserBrowsingHistoryRepository } from '../repositories/UserBrowsingHistoryRepository';

@Service()
export class UserBrowsingHistoryService {

    constructor(
        @OrmRepository() private userBrowsingHistoryRepository: UserBrowsingHistoryRepository) {
    }

    // create customer
    public async create(customer: any): Promise<any> {
        return this.userBrowsingHistoryRepository.save(customer);
    }

    // find Condition
    public findOne(customer: any): Promise<any> {
        return this.userBrowsingHistoryRepository.findOne(customer);
    }

    // find Condition
    public findAll(): Promise<any> {
        return this.userBrowsingHistoryRepository.find();
    }

    // find Condition
    public find(data: any): Promise<any> {
        return this.userBrowsingHistoryRepository.find(data);
    }

    // update customer
    public update(id: any, d: any): Promise<any> {
        console.log('id', id);
        console.log('d', d);
        d.id = id;
        return this.userBrowsingHistoryRepository.save(d);
    }
    public updateMany(arr: any): Promise<any> {
        return this.userBrowsingHistoryRepository.save(arr);
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
            return this.userBrowsingHistoryRepository.count(condition);
        }
        return this.userBrowsingHistoryRepository.find(condition);
    }

     // delete customer
     public async delete(id: number): Promise<any> {
        return await this.userBrowsingHistoryRepository.delete(id);
    }
}
