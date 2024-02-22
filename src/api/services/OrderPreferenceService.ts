import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { OrderPreferenceRepository } from '../repositories/OrderPreferenceRepository';
import { OrderPreference } from '../models/OrderPreference';
import { getConnection } from 'typeorm';
interface Parameters {
    limit?: number;
    offset?: number;
    count?: boolean;
    selects?: any;
    whereConditions?: any;
    groupBy?: any;
    relations?: any;
}

@Service()
export class OrderPreferenceService {

    constructor(
        @OrmRepository() private repo: OrderPreferenceRepository) {
    }
    public async create(result: any): Promise<any> {
        return this.repo.save(result);
    }
    public async find(condition: any): Promise<any> {
        return this.repo.find(condition);
    }
    public async listByQueryBuilder({ limit = 0, offset = 0, selects = [], whereConditions = [], groupBy = [], count = false, relations = [] }: Parameters): Promise<any> {
        const query: any = await getConnection().getRepository(OrderPreference).createQueryBuilder('OrderPreference');
        if (selects && selects.length > 0) {
            query.select(selects);
        }
        if (relations && relations.length > 0) {
            relations.forEach((item: any) => {
                if (item.op === 'inner') {
                    query.innerJoin(item.tableName, item.aliasName);
                }
                if (item.op === 'left') {
                    if (item.condition) {
                        query.leftJoin(item.tableName, item.aliasName, item.condition/*'VendorOrderPreference.vendorId = 43'*/);
                    } else {
                        query.leftJoin(item.tableName, item.aliasName);
                    }
                }
            });
        }
        if (whereConditions && whereConditions.length > 0) {
            whereConditions.forEach((item: any) => {
                if (item.op === 'where') {
                    query.where(item.name + ' = ' + item.value);
                }
                if (item.op === 'andWhere') {
                    query.andWhere(item.name + ' = ' + item.value);
                }
                if (item.op === 'orWhere') {
                    query.orWhere(item.name + ' = ' + item.value);
                }
                if (item.op === 'IN') {
                    query.andWhere(item.name + ' IN (' + item.value + ')');
                }
                // else if (item.op === 'and' && item.sign !== undefined) {
                //     query.andWhere(' \'' + item.name + '\'' + ' ' + item.sign + ' \'' + item.value + '\'');
                // } else if (item.op === 'raw' && item.sign !== undefined) {
                //     query.andWhere(item.name + ' ' + item.sign + ' \'' + item.value + '\'');
                // } else if (item.op === 'or' && item.sign === undefined) {
                //     query.orWhere(item.name + ' = ' + item.value);
                // } else if (item.op === 'IN' && item.sign === undefined) {
                //     query.andWhere(item.name + ' IN (' + item.value + ')');
                // }
            });
        }
        if (groupBy && groupBy.length > 0) {
            let i = 0;
            groupBy.forEach((item: any) => {
                if (i === 0) {
                    query.groupBy(item.name);
                } else {
                    query.addGroupBy(item.name);
                }
                i++;
            });
        }
        if (count) {
            return query.getCount();
        } else {
            if (limit && limit > 0) {
                query.limit(limit).offset(offset);
            }
            return query.getRawMany();
        }
    }
}
