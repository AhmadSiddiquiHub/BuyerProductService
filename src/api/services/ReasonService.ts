import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { ReasonRepository } from '../repositories/ReasonRepository';
import { getConnection  } from 'typeorm';
import { Reason } from '../models/Reason';

@Service()
export class ReasonService {

    constructor(
        @OrmRepository() private repo: ReasonRepository
    ) {}

    public async findOne(id: string, type: string): Promise<any> {
        const selects = [
            'R.id as id',
            'R.description as description',
        ];
        const query: any = await getConnection().getRepository(Reason).createQueryBuilder('R')
        .where('R.id = :id', { id })
        .andWhere('R.reasonType = :type AND R.isActive = 1', { type })
        .select(selects);
        return query.getRawOne();
    }
    public async buyerOrderCancelReasons(): Promise<any> {
        return await this.repo.find({ where: { reasonType: 'CB', isActive: 1 }});
    }
    public async buyerReturnOrderReasons(): Promise<any> {
        return await this.repo.find({ where: { reasonType: 'R', isActive: 1 }});
    }
}
