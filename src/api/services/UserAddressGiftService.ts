import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { UserAddressGiftRepository } from '../repositories/UserAddressGiftRepository';
import { UserAddressGift } from '../models/UserAddressGift';
import { getConnection } from 'typeorm';

@Service()
export class UserAddressGiftService {

    constructor(@OrmRepository() private repo: UserAddressGiftRepository) {
    }

    // create address
    public async create(address: UserAddressGift): Promise<any> {
        return this.repo.save(address);
    }

    // // create address
    // public async list2(address: any): Promise<any> {
    //     return this.repo.list2(address);
    // }
    // find Condition
    public findOne(address: any): Promise<any> {
        return this.repo.findOne(address);
    }
    // public update(id: number, address: AddressGift): Promise<any> {
    //     address.addressId = id;
    //     return this.repo.save(address);
    // }
    public async list(limit: number, offset: number, selects: any = [], whereConditions: any = [], groupBy: any = []): Promise<any> {
        const query: any = await getConnection().getRepository(UserAddressGift).createQueryBuilder('UserAddressGift');
        if (selects && selects.length > 0) {
            query.select(selects);
        }
        if (whereConditions && whereConditions.length > 0) {
            whereConditions.forEach((item: any) => {
                query.where(item.name + ' = ' + item.value);
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
        if (limit && limit > 0) {
            query.limit(limit);
            query.offset(offset);
        }
        return query.getRawMany();
    }
    public async update(id: number, address: any): Promise<any> {
        address.id = id;
        return this.repo.save(address);
    }
    public async delete(id: number): Promise<any> {
        await this.repo.delete(id);
        return 1;
    }
    // public find(address: any): Promise<any> {
    //     return this.repo.find(address);
    // }
}
