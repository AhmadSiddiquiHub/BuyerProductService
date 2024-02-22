
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Like } from 'typeorm/index';
import { CourierRepository } from '../repositories/CourierRepository';
import { Courier } from '../models/Courier';

@Service()
export class CourierService {

    constructor(
        @OrmRepository() private repo: CourierRepository,
        @Logger(__filename) private log: LoggerInterface) {
    }

    // create courier
    public async create(courier: any): Promise<Courier> {
        this.log.info('Create a new state ');
        return this.repo.save(courier);
    }
    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }
    // find Condition
    public findOne(courier: any): Promise<any> {
        return this.repo.findOne(courier);
    }

    // update courier
    public update(id: any, courier: Courier): Promise<any> {
        courier.id = id;
        return this.repo.save(courier);
    }
    // find all
    public findAll(): Promise<any> {
        return this.repo.find();
    }
    // courier List
    public list(limit: any, offset: any, select: any = [], search: any = [], whereConditions: any = [], relation: any = [], count: number | boolean): Promise<any> {
        const condition: any = {};

        if (select && select.length > 0) {
            condition.select = select;
        }
        condition.where = {};

        if (relation && relation.length > 0) {
            condition.relations = relation;
        }

        if (whereConditions && whereConditions.length > 0) {
            whereConditions.forEach((item: any) => {
                condition.where[item.name] = item.value;
            });
        }

        if (search && search.length > 0) {
            search.forEach((table: any) => {
                const operator: string = table.op;
                if (operator === 'where' && table.value !== '') {
                    condition.where[table.name] = table.value;
                } else if (operator === 'like' && table.value !== '') {
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
        } else {
            return this.repo.find(condition);
        }
    }
    // delete courier
    public async delete(id: number): Promise<any> {
        return await this.repo.delete(id);
    }
}
