
import {Service} from 'typedi';
import {OrmRepository} from 'typeorm-typedi-extensions';
import {Logger, LoggerInterface} from '../../decorators/Logger';
import {ProductAnswers} from '../models/ProductAnswers';
import {ProductAnswersRepository} from '../repositories/ProductAnswersRepository';
import {Like} from 'typeorm/index';

@Service()
export class ProductAnswersService {

    constructor(@OrmRepository() private repo: ProductAnswersRepository,
                @Logger(__filename) private log: LoggerInterface) {
    }

    // create Country
    public async create(answer: any): Promise<ProductAnswers> {
        this.log.info('Create a new product answer ');
        return this.repo.save(answer);
    }

    // findCondition
    public findOne(answer: any): Promise<any> {
        return this.repo.findOne(answer);
    }

    // update country
    public update(id: any, answer: ProductAnswers): Promise<any> {
        // answer.answerId = id;
        return this.repo.save(answer);
    }

    // country List
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
          createdAt: 'DESC',
        };

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

    // delete Country
    public async delete(id: number): Promise<any> {
        return await this.repo.delete(id);
    }

     // find a data
     public findAll(productDiscount: any): Promise<ProductAnswers[]> {
        this.log.info('Find a data');
        return this.repo.find(productDiscount);
    }
}
