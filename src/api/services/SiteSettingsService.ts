
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Like } from 'typeorm/index';
import { SiteSettingsRepository } from '../repositories/SiteSettingsRepository';
import { SiteSettings } from '../models/SiteSettings';

@Service()
export class SiteSettingsService {

    constructor(
        @OrmRepository() private repo: SiteSettingsRepository,
        @Logger(__filename) private log: LoggerInterface) {
    }

    // create
    public async create(siteSettings: any): Promise<SiteSettings> {
        this.log.info('Create a new site settings ');
        return this.repo.save(siteSettings);
    }

    // find Condition
    public findOne(siteSettings: any): Promise<any> {
        return this.repo.findOne(siteSettings);
    }

    // update
    public update(siteSettings: SiteSettings): Promise<any> {
        return this.repo.save(siteSettings);
    }

    // List
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
    // delete
    public async delete(id: number): Promise<any> {
        return await this.repo.delete(id);
    }
    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }
}
