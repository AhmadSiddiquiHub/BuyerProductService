import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { SubOrderLogRepository } from '../repositories/SubOrderLogRepository';
import { getConnection  } from 'typeorm';
import { SubOrderLog } from '../models/SubOrderLog';
import { OrderStatuses } from '../models/OrderStatuses';
import { Courier } from '../models/Courier';
// interface Parameters {
//     limit?: number;
//     offset?: number;
//     count?: boolean;
//     selects?: any;
//     whereConditions?: any;
//     groupBy?: any;
//     relations?: any;
//     sort?: any;
// }
@Service()
export class SubOrderLogService {

    constructor(
        @OrmRepository() private repo: SubOrderLogRepository) {
    }
    public async create(result: any): Promise<any> {
        return this.repo.save(result);
    }
    public async update(result: any): Promise<any> {
        return this.repo.save(result);
    }
    public async findOne(condition: any): Promise<any> {
        return this.repo.save(condition);
    }

    public async getStatus(id: number): Promise<any> {
        const selects = [
            'OS.name as status',
            'OS.colorCode as colorCode',
            'OS.id as id',
        ];
        return await getConnection().getRepository(OrderStatuses).createQueryBuilder('OS').select(selects).where('OS.id = :id', { id }).getRawOne();
    }

    public async getCourier(id: number): Promise<any> {
        const selects = [
            'C.name as name',
            'C.id as id',
        ];
        return await getConnection().getRepository(Courier).createQueryBuilder('C').select(selects).where('C.id = :id', { id }).getRawOne();
    }

    public async trackingLogsBySubOrderId(subOrderId: number): Promise<any> {
        const selects = [
            'SOL.createdAt as createdAt',
            'SOL.subOrderId as subOrderId',
            'SOL.reason as reason',
            'SOL.description as description',
            'SOL.statusId as statusId',
            'Status.name as status',
            'Status.colorCode as colorCode',
        ];
        const query: any = await getConnection().getRepository(SubOrderLog).createQueryBuilder('SOL').select(selects)
        .leftJoin(OrderStatuses, 'Status', 'Status.id = SOL.statusId')
        .where('SOL.subOrderId = :subOrderId', { subOrderId })
        // .andWhere('SOL.statusId IN (' + arrayOfStatusIds + ')')
        // .orderBy('SOL.id', 'ASC');
        return query.getRawMany();
    }

    // public async listByQueryBuilder({ limit = 0, offset = 0, selects = [], whereConditions = [], groupBy = [], count = false, relations = [], sort = [] }: Parameters): Promise<any> {
    //     const query: any = await getConnection().getRepository(SubOrderLog).createQueryBuilder('SubOrderLog');
    //     if (selects && selects.length > 0) {
    //         query.select(selects);
    //     }
    //     if (relations && relations.length > 0) {
    //         relations.forEach((item: any) => {
    //             if (item.op === 'inner') {
    //                 query.leftJoin(item.tableName, item.aliasName);
    //             }
    //         });
    //     }
    //     if (whereConditions && whereConditions.length > 0) {
    //         whereConditions.forEach((item: any) => {
    //             if (item.op === 'where') {
    //                 query.where(item.name + ' = ' + item.value);
    //             }
    //             if (item.op === 'andWhere') {
    //                 query.andWhere(item.name + ' = ' + item.value);
    //             }
    //             if (item.op === 'orWhere') {
    //                 query.orWhere(item.name + ' = ' + item.value);
    //             }
    //             if (item.op === 'IN') {
    //                 query.andWhere(item.name + ' IN (' + item.value + ')');
    //             }
    //             // else if (item.op === 'and' && item.sign !== undefined) {
    //             //     query.andWhere(' \'' + item.name + '\'' + ' ' + item.sign + ' \'' + item.value + '\'');
    //             // } else if (item.op === 'raw' && item.sign !== undefined) {
    //             //     query.andWhere(item.name + ' ' + item.sign + ' \'' + item.value + '\'');
    //             // } else if (item.op === 'or' && item.sign === undefined) {
    //             //     query.orWhere(item.name + ' = ' + item.value);
    //             // } else if (item.op === 'IN' && item.sign === undefined) {
    //             //     query.andWhere(item.name + ' IN (' + item.value + ')');
    //             // }
    //         });
    //     }
    //     if (groupBy && groupBy.length > 0) {
    //         let i = 0;
    //         groupBy.forEach((item: any) => {
    //             if (i === 0) {
    //                 query.groupBy(item.name);
    //             } else {
    //                 query.addGroupBy(item.name);
    //             }
    //             i++;
    //         });
    //     }
    //     if (sort && sort.length > 0) {
    //         sort.forEach((item: any) => {
    //             query.orderBy('' + item.name + '', '' + item.order + '');
    //         });
    //     }
    //     if (count) {
    //         return query.getCount();
    //     } else {
    //         if (limit && limit > 0) {
    //             query.limit(limit).offset(offset);
    //         }
    //         return query.getRawMany();
    //     }
    // }
}
