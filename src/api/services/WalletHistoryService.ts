
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { Logger, LoggerInterface } from '../../decorators/Logger';
import { WalletHistoryRepository } from '../repositories/WalletHistoryRepository';
import { WalletHistory } from '../models/WalletHistory';

@Service()
export class WalletHistoryService {

    constructor(
        @OrmRepository() private repository: WalletHistoryRepository,
        @Logger(__filename) private log: LoggerInterface) {
    }

    public async create(data: any): Promise<WalletHistory> {
        this.log.info('Create a new wallet history ');
        return this.repository.save(data);
    }

    public find(data: any): Promise<any> {
        return this.repository.find(data);
    }
    
    public count(condition: any): Promise<any> {
        return this.repository.count(condition);
    }

    public findOne(d: any): Promise<any> {
        return this.repository.findOne(d);
    }

}
