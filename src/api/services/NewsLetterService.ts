import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { NewsLetterRepository } from '../repositories/NewsLetterRepository';
import { NewsLetter } from '../models/NewsLetter';
@Service()
export class NewsLetterService {

    constructor(
        @OrmRepository() private repository: NewsLetterRepository,
        @Logger(__filename) private log: LoggerInterface) {
    }

    // find one condition
    public findOne(newsLetter: any): Promise<any> {
        return this.repository.findOne(newsLetter);
    }

    // find all newsLetter
    public findAll(newsLetter: any): Promise<any> {
        this.log.info('Find all newsLetter');
        return this.repository.find(newsLetter);
    }

    // create newsLetter
    public async create(newsLetter: any): Promise<NewsLetter> {
        const newnewsLetter = await this.repository.save(newsLetter);
        return newnewsLetter;
    }

    // update newsLetter
    public update(id: any, newsLetter: NewsLetter): Promise<NewsLetter> {
        this.log.info('Update a newsLetter');
        newsLetter.id = id;
        return this.repository.save(newsLetter);
    }

    // delete newsLetter
    public async delete(id: any): Promise<any> {
        this.log.info('Delete a newsLetter');
        const newnewsLetter = await this.repository.delete(id);
        return newnewsLetter;
    }
}
