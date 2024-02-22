import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { ProductQuestions } from '../models/ProductQuestions';
import { ProductQuestionsRepository } from '../repositories/ProductQuestionsRepository';
import { getConnection, Like, Brackets } from 'typeorm/index';
import { ProductAnswers } from '../models/ProductAnswers';
import { Users } from '../models/Users';
import { Product } from '../models/Product';
import { VendorProductVariants } from '../models/VendorProductVariants';
import { ProductVariantImages } from '../models/ProductVariantImages';

interface QaListParams {
    limit: number,
    offset: number,
    siteId: number,
    productId: number,
    keyword: string,
    count: boolean
}
@Service()
export class ProductQuestionsService {

    constructor(
        @OrmRepository() private productQuestionRepository: ProductQuestionsRepository,
        @Logger(__filename) private log: LoggerInterface) {
    }

    // create Country
    public async create(question: any): Promise<ProductQuestions> {
        this.log.info('Create a new product question ');
        return this.productQuestionRepository.save(question);
    }

    // findCondition
    public findOne(question: any): Promise<any> {
        return this.productQuestionRepository.findOne(question);
    }

    // update country
    public update(id: any, question: ProductQuestions): Promise<any> {
        // question.questionId = id;
        return this.productQuestionRepository.save(question);
    }
    public async qaList({ limit, offset, siteId, productId, keyword, count }: QaListParams) {
        const selects = [
            'PQ.question as question',
            'PQ.created_at as createdAt',
            'PA.answer as answer',
            'U.first_name as firstName',
        ];
        const query: any = await getConnection().getRepository(ProductQuestions).createQueryBuilder('PQ')
        .select(selects)
        .where(`PQ.siteId = ${ siteId }` )
        .andWhere(`PQ.productId = ${ productId } AND PQ.isActive = 1 AND PQ.isApproved = 1`)
        .leftJoin(ProductAnswers, 'PA', 'PA.productQuestionId = PQ.id')
        .leftJoin(Users, 'U', 'U.id = PQ.user_id')
        .orderBy('PQ.id', 'DESC');
        if (keyword) {
            const searchCols = [
                { column: 'PQ.question' },
                // { column: 'PA.answer' },
            ];
            searchCols.forEach((x, i) => {
                query.andWhere(new Brackets(qb => {
                    if (i === 0) {
                        qb.andWhere('LOWER(' + x.column + ')' + ' LIKE ' + '\'%' + keyword + '%\'');
                    } else {
                        qb.orWhere('LOWER(' + x.column + ')' + ' LIKE ' + '\'%' + keyword + '%\'');
                    }
                })); 
            });
        }
        const response: any = {};
        response.count = await query.getCount();
        query.limit(limit).offset(offset);
        response.qaList = await query.getRawMany();
        return response;
    }

    public async qaListForVendor(limit: number, offset: number, siteId: number, vendorId: any) {
        const selects = [
            'product_questions.id as questionId',
            'product_questions.vendorId as vendorId',
            'product_questions.question as question',
            'product_answers.answer as answer',
            'P.name as name',
            'pvi.image as image',
            'users.first_name as first_name',
            'product_questions.created_at as created_at'
        ];
        const query: any = await getConnection().getRepository(ProductQuestions).createQueryBuilder('product_questions');
        query.select(selects);
        query.where(`product_questions.siteId = ${ siteId }` );
        query.andWhere(`product_questions.vendorId = ${ vendorId }`);
        query.innerJoin(Product, 'P', 'P.id = product_questions.productId');
        query.innerJoin(VendorProductVariants, 'VPV', `VPV.productId = product_questions.productId`);
        query.innerJoin(ProductVariantImages, 'pvi', `VPV.product_variant_id = pvi.product_variants_id`);
        query.leftJoin(ProductAnswers, 'product_answers', 'product_answers.product_question_id = product_questions.id');
        query.leftJoin(Users, 'users', 'users.id = product_questions.user_id');
        if (limit && limit > 0) {
            query.limit(limit);
            query.offset(offset);
        }
        query.groupBy('product_questions.productId')
        return query.getRawMany();
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
            return this.productQuestionRepository.count(condition);
        } else {
            return this.productQuestionRepository.find(condition);
        }
    }

    // delete Country
    public async delete(id: number): Promise<any> {
        return await this.productQuestionRepository.delete(id);
    }

    // find a data
    public findAll(productDiscount: any): Promise<ProductQuestions[]> {
        this.log.info('Find a data');
        return this.productQuestionRepository.find(productDiscount);
    }
}
