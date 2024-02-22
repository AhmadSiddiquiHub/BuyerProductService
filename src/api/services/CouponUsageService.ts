import { Service } from 'typedi';
import { CouponUsage } from '../models/CouponUsage';
import { getConnection, Like } from 'typeorm/index';
import { Coupon } from '../models/Coupon';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { CouponUsageRepository } from '../repositories/CouponUsageRepository';
import { CouponUser } from '../models/CouponUser';

@Service()
export class CouponUsageService {

    constructor(@OrmRepository() private repo: CouponUsageRepository
    ) {
    }

    // create
    public async create(data: any): Promise<any> {
        return this.repo.save(data);
    }

    // find Condition
    public findOne(data: any): Promise<any> {
        return this.repo.findOne(data);
    }

    // find Condition
    public findAll(data: any): Promise<any> {
        return this.repo.find(data);
    }

    // update customer
    public update(id: any, data: any): Promise<any> {
        data.Id = id;
        return this.repo.save(data);
    }
    //  List
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

        // condition.order = {
        //     createdDate: 'DESC',
        // };

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
    
    public async current(userId: number) {
        const selects = [
            'coupon.couponName as couponName',
            'coupon.id as couponId',
            'coupon.value as value', 
            'coupon.valueType as valueType',
            'coupon.couponCode as couponCode', 
            'coupon.type as couponType',
            'coupon.startDate as couponStartDate',
            'coupon.endDate as couponEndDate',
            'coupon_users.userId as userId',
            // `(SELECT couponUsage.coupon_id as couponId, couponUsage.user_id as userId FROM coupon_usage as couponUsage WHERE couponUsage.coupon_id = coupon.id AND couponUsage.user_id = ${userId}) as couponUsage`,

        ];
        const query: any = await getConnection().getRepository(CouponUser).createQueryBuilder('coupon_users').select(selects)
        .leftJoin(Coupon, 'coupon', 'coupon_users.couponId = coupon.couponId')
        // .leftJoin(CouponUsage, 'coupon_usage', 'coupon_usage.couponId = coupon.couponId')
        .where('coupon.isActive = :isActive', { isActive: 1 })
        .andWhere('coupon_users.userId = :userId', { userId })
        // .andWhere('coupon_usage.userId <> :userId', { userId })
        .andWhere('(coupon.startDate <= NOW() AND coupon.endDate >= NOW())')
        .groupBy('coupon.couponName');
        return query.getRawMany();
    }
    public async past(userId: number) {
        const selects = [
            'coupon.couponName as couponName',
            'coupon.id as couponId',
            'coupon.value as value', 
            'coupon.valueType as valueType',
            'coupon.couponCode as couponCode', 
            'coupon.type as couponType',
            'coupon.startDate as couponStartDate',
            'coupon.endDate as couponEndDate',
            'coupon_usage.userId as userId',
        ];
        const query: any = await getConnection().getRepository(CouponUsage).createQueryBuilder('coupon_usage')
        .select(selects)
        .where('coupon_usage.userId = :userId', { userId })
        // .andWhere('(coupon.endDate < NOW())')
        .innerJoin(Coupon, 'coupon', 'coupon_usage.couponId = coupon.couponId')
        .groupBy('coupon.couponName');
        return query.getRawMany();
    }
}
