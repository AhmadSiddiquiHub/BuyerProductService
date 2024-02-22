import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Like } from 'typeorm/index';
import { CampaignProductsRepository } from '../repositories/CampaignProductsRepository';

@Service()
export class CampaignProductsService {

    constructor(@OrmRepository() private repo: CampaignProductsRepository
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
}
