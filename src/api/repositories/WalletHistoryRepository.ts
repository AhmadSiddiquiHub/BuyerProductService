import { EntityRepository, Repository } from 'typeorm';
import { WalletHistory } from '../models/WalletHistory';

@EntityRepository(WalletHistory)
export class WalletHistoryRepository extends Repository<WalletHistory> {

}
