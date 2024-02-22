
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Like } from 'typeorm/index';
import { StatesRepository } from '../repositories/StatesRepository';
import { States } from '../models/States';

@Service()
export class StatesService {

    constructor(
        @OrmRepository() private statesRepository: StatesRepository,
        @Logger(__filename) private log: LoggerInterface) {
    }

    // create states
    public async create(states: any): Promise<States> {
        this.log.info('Create a new state ');
        return this.statesRepository.save(states);
    }

     // find Condition
    public find(states: any): Promise<any> {
        return this.statesRepository.find(states);
    }
    // find Condition
    public findOne(states: any): Promise<any> {
        return this.statesRepository.findOne(states);
    }

    // update states
    public update(id: any, states: States): Promise<any> {
        states.id = id;
        return this.statesRepository.save(states);
    }
    searchs
    // states List
    public list(limit?: any, offset?: any, select: any = [], search: any = [], whereConditions: any = [], relation: any = [], count?: number | boolean): Promise<any> {
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
            return this.statesRepository.count(condition);
        } else {
            return this.statesRepository.find(condition);
        }
    }
    // delete State
    public async delete(id: number): Promise<any> {
        return await this.statesRepository.delete(id);
    }
}
