import { Service } from 'typedi';
import { Like } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { BannerTypeRepository } from '../repositories/BannerTypeRepository';

@Service()
export class BannerTypeService {

    constructor(
        @OrmRepository() private bannerTypeRepository: BannerTypeRepository) {
    }
     // create customer
     public async create(result: any): Promise<any> {
        return this.bannerTypeRepository.save(result);
     }
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
                if (operator === 'where' && table.value !== undefined) {
                    condition.where[table.name] = table.value;
                } else if (operator === 'like' && table.value !== undefined) {
                    condition.where[table.name] = Like('%' + table.value + '%');
                }
            });
        }

        if (limit && limit > 0) {
            condition.take = limit;
            condition.skip = offset;
        }

        // condition.order = {
        //     position: 'ASC',
        //     createdDate: 'DESC',
        // };

        if (count) {
            return this.bannerTypeRepository.count(condition);
        } else {
            return this.bannerTypeRepository.find(condition);
        }
    }
}
