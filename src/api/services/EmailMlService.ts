import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Like } from 'typeorm/index';
import { EmailMlRepository } from '../repositories/EmailMlRepository';

@Service()
export class EmailMlService {
    constructor(
        @OrmRepository() private emailTemplateRepository: EmailMlRepository,
        @Logger(__filename) private log: LoggerInterface) {
    }

    // Create emailTemplate
    public async create(emailTemplate: any): Promise<any> {
        this.log.info('Create a new emailTemplate ');
        return this.emailTemplateRepository.save(emailTemplate);
    }

    // Find Condition
    public findOne(emailTemplate: any): Promise<any> {
        return this.emailTemplateRepository.findOne(emailTemplate);
    }
    public capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    // Update EmailTemplate
    public update(id: any, emailTemplate: any): Promise<any> {
        emailTemplate.id = id;
        return this.emailTemplateRepository.save(emailTemplate);
    }

    // EmailTemplate List
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
            createdDate: 'DESC',
        };

        if (limit && limit > 0) {
            condition.take = limit;
            condition.skip = offset;
        }
        if (count) {
            return this.emailTemplateRepository.count(condition);
        } else {
            return this.emailTemplateRepository.find(condition);
        }
    }

    // Delete EmailTemplate
    public async delete(id: number): Promise<any> {
        return await this.emailTemplateRepository.delete(id);
    }
}
