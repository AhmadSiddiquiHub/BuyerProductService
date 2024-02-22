import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { CountriesRepository } from '../repositories/CountriesRepository';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Countries } from '../models/Countries';
import { Like } from 'typeorm/index';
@Service()
export class CountriesService {

    constructor(
        @OrmRepository() private countriesRepository: CountriesRepository,
        @Logger(__filename) private log: LoggerInterface) {
    }

    // create Countries
    public async create(Country: any): Promise<Countries> {
        this.log.info('Create a new Countries ');
        return this.countriesRepository.save(Country);
    }
    // find Condition
    public findAll(): Promise<any> {
        return this.countriesRepository.find();
    }
    // findCondition
    public findOne(Country: any): Promise<any> {
        return this.countriesRepository.findOne(Country);
    }

    // update Countries
    public update(id: any, Country: Countries): Promise<any> {
        Country.countriesId = id;
        return this.countriesRepository.save(Country);
    }

    // Countries List
    public list(limit: any, offset: any, select: any = [], search: any = [], whereConditions: any = [], count: number | boolean): Promise<any> {
        const condition: any = {};

        if (select && select.length > 0) {
            condition.select = select;
        }
        condition.where = {};

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

        condition.order = {
            name: 'ASC',
        };

        if (limit && limit > 0) {
            condition.take = limit;
            condition.skip = offset;
        }
        if (count) {
            return this.countriesRepository.count(condition);
        } else {
            console.log(condition);
            return this.countriesRepository.find(condition);
        }
    }
    // delete Countries
    public async delete(id: number): Promise<any> {
        return await this.countriesRepository.delete(id);
    }
}
