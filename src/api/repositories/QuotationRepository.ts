import { EntityRepository, Repository } from 'typeorm';
import { Quotation } from '../models/Quotation';

@EntityRepository(Quotation)
export class QuotationRepository extends Repository<Quotation>  {
    // public async getRegion(parent: any): Promise<any> {
    //     const selects = [
    //         'region.id as id',
    //         'region.name as name',
    //         'region.regionType as regionType',
    //         'region.parent as parent',
    //     ];
    //     const query: any = await this.manager.createQueryBuilder(Region, 'region');
    //     query.select(selects);
    //     query.andWhere('region.parent = :parent', { parent });
    //     return query.getRawMany();
    // }
}
