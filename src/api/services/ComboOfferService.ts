import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
// import { Like } from 'typeorm/index';
import { ComboOfferRepository } from '../repositories/ComboOfferRepository';
import { ComboOffer } from '../models/ComboOffer';
import { getConnection } from 'typeorm';
// import { LessThanOrEqual, MoreThanOrEqual, LessThan } from 'typeorm';
@Service()
export class ComboOfferService {

    constructor(@OrmRepository() private repo: ComboOfferRepository) {
    }

    public async create(condtion: any): Promise<any> {
        return this.repo.save(condtion);
    }

    public async findOneByProductId(productId: number): Promise<any> {
        const selects = [
            'ComboOffer.id as comboOfferiId',
            'ComboOffer.vendorId as vendorId',
            'ComboOffer.name as name',
            'ComboOffer.description as description',
            'ComboOffer.discount as discount',
            'ComboOffer.isActive as isActive',
            'ComboOffer.productIds as productIds',
            'ComboOffer.createdAt as createdAt',
            'ComboOffer.updatedAt as updatedAt',
        ];
        const query: any = await getConnection().getRepository(ComboOffer).createQueryBuilder('ComboOffer')
        .select(selects)
        .where('ComboOffer.productIds LIKE ' + "\'%" + productId + "%\'");
        return query.getRawOne();
    }

}
