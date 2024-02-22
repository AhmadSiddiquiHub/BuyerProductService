import { Service } from 'typedi';
import { getConnection } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Product } from '../models/Product';
import { ProductVariants } from '../models/ProductVariants';
import { UserWishlist } from '../models/UserWishList';
import { VendorProductVariants } from '../models/VendorProductVariants';
// import { VendorProductVariants } from '../models/VendorProductVariants';
import { UserWishlistRepository } from '../repositories/UserWishlistRepository';
interface Parameters {
    limit?: number;
    offset?: number;
    count?: boolean;
    selects?: any;
    select2?: any;
    whereConditions?: any;
    w2?: any;
    groupBy?: any;
    relations?: any;
}
@Service()
export class UserWishlistService {

    constructor(
        @OrmRepository() private userWishlistRepository: UserWishlistRepository) {
    }

    // create customer
    public async create(customer: any): Promise<any> {
        return this.userWishlistRepository.save(customer);
    }

    // find Condition
    public findOne(customer: any): Promise<any> {
        return this.userWishlistRepository.findOne(customer);
    }

    // find Condition
    public findAll(): Promise<any> {
        return this.userWishlistRepository.find();
    }

    // find Condition
    public find(data: any): Promise<any> {
        return this.userWishlistRepository.find(data);
    }

    // update customer
    public update(id: any, customer: any): Promise<any> {
        customer.customerId = id;
        return this.userWishlistRepository.save(customer);
    }

    // delete
    public async delete(id: number): Promise<any> {
        return await this.userWishlistRepository.delete(id);
    }

    public async clearUserWishList(userId: any, siteId: any): Promise<any> {
        return await getConnection().getRepository(UserWishlist).createQueryBuilder()
        .where('userId = :userId', { userId })
        .andWhere('siteId = :siteId', { siteId })
        .delete()
        .execute();
    }

    public async pids(id: any, siteId: any): Promise<any> {
        const query: any = await getConnection().getRepository(UserWishlist).createQueryBuilder('UserWishList');
        query.select('UserWishList.productId', 'product.id');
        query.where('UserWishList.userId = :userId', { userId: id });
        query.andWhere('UserWishList.siteId  = :siteId', { siteId: siteId });
        query.innerJoin(Product, 'product', 'product.id = UserWishList.productId');
        return query.getRawMany();
    }
    public async listByQueryBuilder({ limit = 0, offset = 0, selects = [], whereConditions = [], groupBy = [], count = false, relations = [] }: Parameters): Promise<any> {
        const query: any = await getConnection().getRepository(UserWishlist).createQueryBuilder('UserWishList');
        query.innerJoin(Product, 'Product', 'Product.id = UserWishList.productId');
        query.innerJoin(ProductVariants, 'ProductVariants', 'ProductVariants.productId = UserWishList.productId');
        query.innerJoin(VendorProductVariants, 'VendorProductVariants', 'VendorProductVariants.productId = UserWishList.productId');
       // query.innerJoin(Product, 'Product', 'Product.id = VendorProduct.productId');
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
                        query.leftJoin(item.tableName, item.aliasName, item.condition);
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
