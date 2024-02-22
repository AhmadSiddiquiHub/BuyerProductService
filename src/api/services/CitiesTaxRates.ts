
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Like } from 'typeorm/index';
import { CitiesTaxRateRepository } from '../repositories/CitiesTaxRateRepository';
import { CitiesTaxRate } from '../models/CitiesTaxRate';

@Service()
export class CitiesTaxRates {

    constructor(
        @OrmRepository() private repo: CitiesTaxRateRepository,
        @Logger(__filename) private log: LoggerInterface) {
    }

    // create cities
    public async create(cities: any): Promise<CitiesTaxRate> {
        this.log.info('Create a new city ');
        return this.repo.save(cities);
    }

    // find Condition
    public findOne(cities: any): Promise<any> {
        return this.repo.findOne(cities);
    }

    // update cities
    public update(id: any, cities: CitiesTaxRate): Promise<any> {
        cities.id = id;
        return this.repo.save(cities);
    }

    // cities List
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
            return this.repo.count(condition);
        } else {
            return this.repo.find(condition);
        }
    }
    // delete State
    public async delete(id: number): Promise<any> {
        return await this.repo.delete(id);
    }
    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }
}
