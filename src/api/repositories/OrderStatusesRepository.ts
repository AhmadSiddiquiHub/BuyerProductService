import { EntityRepository, Repository } from 'typeorm';
import { OrderStatuses } from '../models/OrderStatuses';
import { OrderStatusesMl } from '../models/OrderStatusML';

@EntityRepository(OrderStatuses)
export class OrderStatusesRepository extends Repository<OrderStatuses>  {
    
    public async getOrderStatuses(siteId: any, langId: any): Promise<any> {
        const selects = [
            'OML.name as name',
            'O.id as id',
            'O.colorCode as colorCode',
        ];
        const query: any = await this.manager.createQueryBuilder(OrderStatuses, 'O')
        .innerJoin(OrderStatusesMl, 'OML', 'OML.orderStatusId = O.id')
        .select(selects)
        .andWhere('OML.lang_id = :langId', { langId });
        return query.getRawMany();
    }
}
